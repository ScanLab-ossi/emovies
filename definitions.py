import os

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
NRC_JSON_PATH = os.path.join(ROOT_DIR, 'backend', 'NRC.json')

DATA_DIR = os.path.join(ROOT_DIR, 'data')
CONFIG_DIR = os.path.join(ROOT_DIR, 'config')
WEBSITE = os.path.join(ROOT_DIR, "Website")
SMALL_CSV = os.path.join(WEBSITE, 'data', 'data.csv')
FULL_CSV = os.path.join(WEBSITE, 'data', 'base.csv')
