from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Week(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    week_identifier = db.Column(db.String, unique=True, nullable=False)
    guiding_principles = db.Column(db.Text, nullable=True)
    daily_affirmations = db.Column(db.Text, nullable=True)
    blocks = db.relationship('Block', backref='week', lazy=True, cascade="all, delete-orphan")
    daily_inputs = db.relationship('DailyInput', backref='week', lazy=True, cascade="all, delete-orphan")

class Block(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    week_id = db.Column(db.Integer, db.ForeignKey('week.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    original_index = db.Column(db.Integer) # To maintain order if needed
    choices = db.relationship('Choice', backref='block', lazy=True, cascade="all, delete-orphan")

class Choice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    block_id = db.Column(db.Integer, db.ForeignKey('block.id'), nullable=False)
    text = db.Column(db.String, nullable=False)
    original_index = db.Column(db.Integer) # To maintain order within a block
    completions = db.relationship('Completion', backref='choice', lazy=True, cascade="all, delete-orphan")

class Completion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    choice_id = db.Column(db.Integer, db.ForeignKey('choice.id'), nullable=False)
    day_index = db.Column(db.Integer, nullable=False) # 0-6 for Mon-Sun
    is_completed = db.Column(db.Boolean, nullable=False, default=False)

class DailyInput(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    week_id = db.Column(db.Integer, db.ForeignKey('week.id'), nullable=False)
    day_index = db.Column(db.Integer, nullable=False) # 0-6 for Mon-Sun
    value_creation = db.Column(db.Text, nullable=True)
    meditation = db.Column(db.Text, nullable=True) 