#!/bin/bash
cd "$(dirname "$0")"
exec gunicorn --config gunicorn.conf.py wsgi:application 