import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, Week, Block, Choice, Completion, DailyInput

# Initial data structure (mirrors frontend initialBlocks)
initial_blocks_data = [
    {
        "name": "1. Prime",
        "description": "Build Your Higher Self",
        "choices": ["Rise early", "God First", "Learn", "Exercise", "Meditation", "Nutrition"],
    },
    {
        "name": "2. Prosper",
        "description": "Create and Monetize Value",
        "choices": ["DW#1 TCF", "DW#2 GrowTime AI", "DW#3 BubbleTech"],
    },
    {
        "name": "3. Play",
        "description": "Enjoy the Best Things Life Has to Offer",
        "choices": ["Quality Time With Loved Ones", "Fun", "Plan and Enjoy Transformational Experiences"],
    },
    {
        "name": "4. Purpose",
        "description": "Contribute Locally and Globally",
        "choices": ["Sagetown", "FUNDEMEX"],
    },
    {
        "name": "5. Peace",
        "description": "Wind Down, Rest Well",
        "choices": ["Meditation", "Sleep early"],
    },
]

def create_app():
    app = Flask(__name__)
    # Configure the SQLAlchemy part of the app instance
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.instance_path, 'database.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Initialize extensions
    db.init_app(app)
    CORS(app) # Enable CORS for all routes

    with app.app_context():
        db.create_all() # Create database tables if they don't exist

    # --- Helper Function --- 
    def create_initial_week_data(week_identifier):
        """Creates the initial structure for a given week if it doesn't exist."""
        week = Week.query.filter_by(week_identifier=week_identifier).first()
        if not week:
            print(f"Creating initial data for week: {week_identifier}")
            week = Week(week_identifier=week_identifier, guiding_principles="", daily_affirmations="")
            db.session.add(week)
            # Flush to get the week ID
            db.session.flush()

            for block_idx, block_data in enumerate(initial_blocks_data):
                new_block = Block(
                    week_id=week.id,
                    name=block_data['name'],
                    description=block_data['description'],
                    original_index=block_idx
                )
                db.session.add(new_block)
                db.session.flush() # Flush to get the block ID

                for choice_idx, choice_text in enumerate(block_data['choices']):
                    new_choice = Choice(
                        block_id=new_block.id,
                        text=choice_text,
                        original_index=choice_idx
                    )
                    db.session.add(new_choice)
                    db.session.flush() # Flush to get the choice ID

                    # Create initial completion records (all false)
                    for day_i in range(7):
                        completion = Completion(choice_id=new_choice.id, day_index=day_i, is_completed=False)
                        db.session.add(completion)
            
            # Create initial daily input records (all empty)
            for day_i in range(7):
                daily_input = DailyInput(week_id=week.id, day_index=day_i, value_creation="", meditation="")
                db.session.add(daily_input)
                
            db.session.commit()
        else:
             print(f"Data for week {week_identifier} already exists.")
        return week


    # --- API Routes --- 
    @app.route('/api/weeks', methods=['GET'])
    def get_weeks():
        weeks = Week.query.with_entities(Week.week_identifier).all()
        return jsonify([w.week_identifier for w in weeks])

    @app.route('/api/data/<string:week_identifier>', methods=['GET'])
    def get_week_data(week_identifier):
        week = Week.query.filter_by(week_identifier=week_identifier).first()
        
        if not week:
            # If week doesn't exist, create it with initial data
            week = create_initial_week_data(week_identifier)
            # Relaod week to ensure relationships are loaded correctly
            week = Week.query.filter_by(week_identifier=week_identifier).first()

        if not week: # Should not happen after creation attempt, but check anyway
             return jsonify({"error": "Week not found and could not be created"}), 404

        blocks_data = []
        for block in sorted(week.blocks, key=lambda b: b.original_index):
            choices_data = []
            for choice in sorted(block.choices, key=lambda c: c.original_index):
                completions = sorted(choice.completions, key=lambda comp: comp.day_index)
                choices_data.append({
                    "id": choice.id, # Send ID for potential future use
                    "text": choice.text,
                    "completions": [c.is_completed for c in completions]
                })
            blocks_data.append({
                "id": block.id,
                "name": block.name,
                "description": block.description,
                "choices": choices_data
            })

        daily_inputs = sorted(week.daily_inputs, key=lambda di: di.day_index)
        response_data = {
            "week_identifier": week.week_identifier,
            "guiding_principles": week.guiding_principles,
            "daily_affirmations": week.daily_affirmations,
            "blocks": blocks_data,
            "daily_value_creation": [di.value_creation for di in daily_inputs],
            "daily_meditations": [di.meditation for di in daily_inputs]
        }
        return jsonify(response_data)

    @app.route('/api/data/<string:week_identifier>', methods=['POST'])
    def save_week_data(week_identifier):
        data = request.json
        week = Week.query.filter_by(week_identifier=week_identifier).first()

        if not week:
             # Optionally create the week if it doesnt exist on save? 
             # For now, let's assume GET is called first to ensure creation
             # week = create_initial_week_data(week_identifier)
             # week = Week.query.filter_by(week_identifier=week_identifier).first()
             # if not week:
              return jsonify({"error": "Week not found. Please load the week first."}), 404

        try:
            # Update Week level data
            week.guiding_principles = data.get('guidingPrinciples', week.guiding_principles)
            week.daily_affirmations = data.get('dailyAffirmations', week.daily_affirmations)

            # Update Blocks, Choices, Completions
            block_map = {b.id: b for b in week.blocks}
            choice_map = {c.id: c for b in week.blocks for c in b.choices}
            completion_map = { (comp.choice_id, comp.day_index): comp for choice in choice_map.values() for comp in choice.completions }

            new_block_indices_processed = set()

            for block_idx, block_data in enumerate(data.get('blocks', [])):
                block_id = block_data.get('id')
                block = None
                
                # Try to find existing block by id or index/name if id is missing (e.g. new block added in frontend)
                if block_id and block_id in block_map:
                    block = block_map[block_id]
                else:
                    # Look for block by original index if ID is missing
                    # This handles the case where frontend might not send back IDs for initial blocks
                    existing_blocks_at_index = [b for b in week.blocks if b.original_index == block_idx]
                    if existing_blocks_at_index:
                        block = existing_blocks_at_index[0]
                    else:
                         # Block is genuinely new (added via UI)
                        block = Block(
                            week_id=week.id, 
                            name=block_data['name'], 
                            description=block_data.get('description', ''),
                            original_index=block_idx # Use current index as original for new
                        )
                        db.session.add(block)
                        db.session.flush() # Need ID for choices
                        print(f"Added new block: {block.name}")
                
                if block:
                    new_block_indices_processed.add(block.original_index if block.original_index is not None else block_idx)
                    block.name = block_data.get('name', block.name)
                    block.description = block_data.get('description', block.description)
                    block.original_index = block_idx # Update order
                    
                    new_choice_indices_processed = set()
                    
                    for choice_idx, choice_data in enumerate(block_data.get('choices', [])):
                        choice_id = choice_data.get('id')
                        choice = None
                        
                        # Find existing choice by id or index/text
                        if choice_id and choice_id in choice_map and choice_map[choice_id].block_id == block.id:
                            choice = choice_map[choice_id]
                        else:
                            # Look for choice by original index if ID missing
                            existing_choices_at_index = [c for c in block.choices if c.original_index == choice_idx]
                            if existing_choices_at_index:
                                choice = existing_choices_at_index[0]
                            else:
                                # Choice is genuinely new
                                choice = Choice(
                                    block_id=block.id, 
                                    text=choice_data['text'],
                                    original_index=choice_idx
                                )
                                db.session.add(choice)
                                db.session.flush() # Need ID for completions
                                print(f"Added new choice: {choice.text} to block {block.name}")
                                # Add default completions for the new choice
                                for day_i in range(7):
                                    comp = Completion(choice_id=choice.id, day_index=day_i, is_completed=False)
                                    db.session.add(comp)
                                    completion_map[(choice.id, day_i)] = comp # Add to map
                                choice_map[choice.id] = choice # Add to map
                        
                        if choice:
                            new_choice_indices_processed.add(choice.original_index if choice.original_index is not None else choice_idx)
                            choice.text = choice_data.get('text', choice.text)
                            choice.original_index = choice_idx # Update order
                            
                            # Update completions
                            completions_data = choice_data.get('completions', [])
                            for day_idx, is_completed in enumerate(completions_data):
                                if day_idx < 7:
                                    comp = completion_map.get((choice.id, day_idx))
                                    if comp:
                                        comp.is_completed = is_completed
                                    else:
                                        # Should exist if choice exists, but handle defensively
                                        comp = Completion(choice_id=choice.id, day_index=day_idx, is_completed=is_completed)
                                        db.session.add(comp)
                                        print(f"Warning: Created missing completion for choice {choice.id}, day {day_idx}")
                                        completion_map[(choice.id, day_idx)] = comp

                    # Delete choices that were removed in the frontend
                    existing_choice_indices = {c.original_index for c in block.choices if c.original_index is not None}
                    indices_to_delete = existing_choice_indices - new_choice_indices_processed
                    choices_to_delete = [c for c in block.choices if c.original_index in indices_to_delete]
                    if choices_to_delete:
                        print(f"Deleting choices for block {block.name}: {[c.text for c in choices_to_delete]}")
                        for c_del in choices_to_delete:
                            db.session.delete(c_del)

            # Delete blocks that were removed in the frontend
            existing_block_indices = {b.original_index for b in week.blocks if b.original_index is not None}
            indices_to_delete = existing_block_indices - new_block_indices_processed
            blocks_to_delete = [b for b in week.blocks if b.original_index in indices_to_delete]
            if blocks_to_delete:
                print(f"Deleting blocks: {[b.name for b in blocks_to_delete]}")
                for b_del in blocks_to_delete:
                    db.session.delete(b_del)
            
            # Update Daily Inputs
            daily_value_creation = data.get('dailyValueCreation', [])
            daily_meditations = data.get('dailyMeditations', [])
            daily_input_map = {di.day_index: di for di in week.daily_inputs}

            for day_idx in range(7):
                daily_input = daily_input_map.get(day_idx)
                if not daily_input:
                    daily_input = DailyInput(week_id=week.id, day_index=day_idx)
                    db.session.add(daily_input)
                    print(f"Warning: Creating missing daily input for day {day_idx}")
                    daily_input_map[day_idx] = daily_input
                
                if day_idx < len(daily_value_creation):
                    daily_input.value_creation = daily_value_creation[day_idx]
                if day_idx < len(daily_meditations):
                    daily_input.meditation = daily_meditations[day_idx]
            
            db.session.commit()
            return jsonify({"message": "Data saved successfully"})
        
        except Exception as e:
            db.session.rollback()
            print(f"Error saving data: {e}") # Log error server-side
            return jsonify({"error": f"An error occurred while saving data: {e}"}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True) 