import json
import os

from definitions import CONFIG_DIR


def load_config(config_name):
    """ Method used for loading config files

    :param config_name: config to load
    :return: dict of the config
    """
    if not config_name.endswith('.json'):
        config_name = config_name + '.json'

    config_name = os.path.join(CONFIG_DIR, config_name)
    with open(config_name) as file:
        dc = json.load(file)

    return dc


def save_config(data: dict, config_name):
    """ Saves data as a config file

    :param data: dictionary to save
    :param config_name: name of the config file
    """
    if not config_name.endswith('.json'):
        config_name = config_name + '.json'

    config_name = os.path.join(CONFIG_DIR, config_name)
    with open(config_name, 'w') as file:
        json.dump(data, file)

