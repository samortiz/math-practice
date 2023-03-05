import string
from functools import reduce

from django.utils.crypto import get_random_string
from rest_framework.response import Response

CODE_ALLOWED_CHARS = 'BCDFGHJKMNPQRSTVWXYZ23456789'


def get_key(obj, key, default=None):
    """
     Gets the value of the key from the object / map.  This makes getting objects a one-liner
     This prevents KeyError when the key is missing.
     eg. obj = {name: "Joe"}
       get(obj, "name") will return "joe"
       get(obj, "lastname") will return None
       get(obj, "lastname", "") will return ""
    """
    if key in obj:
        return obj[key]
    return default


def get_key_deep(dictionary, keys, default=None):
    """
        Traverses a dictionary object and returns the resulting node or default if it cannot find it
        eg.
          obj = {'user': {'name': 'Joe', 'address': {'street': 'Elm'}}}
          getKeyDeep(obj, key, 'default')

          'err'                 =>  'default'
          'user'                =>  {'name': 'Joe', 'address': {'street': 'Elm'}}
          'user.name'           =>  'Joe'
          'user.address.street' =>  'Elm'
          'user.address.err'    =>  'default'
        Credits: Yuda Prawira https://stackoverflow.com/questions/25833613/safe-method-to-get-value-of-nested-dictionary
    """
    return reduce(lambda d, key: d.get(key, default) if isinstance(d, dict) else default, keys.split("."), dictionary)


def response_with_errors(errors):
    """
    Returns a response with no data and only errors
    This will always return a 200 response, but the body will contain
     {status:X, errors:[{message:"err msg here", fields:["fieldName"...]}...] }
    the internal status will be 400 if there are errors
    :param errors: array with error objects
    :return: a 200 Response
    """
    data = {
        'status': 400 if errors else 200,
        'data': None,
        'errors': errors,
    }
    return Response(data)


def response_with_data_and_errors(data, errors):
    """
    Returns a response with data and errors
    This will always return a 200 response, but the body will contain
     {status:X, data:X, errors:[{message:"err msg here", fields:["fieldName"...]}...] }
    the internal status will be 400 if there are errors
    :param data: data object to return (may be literal, object or array)
    :param errors: array with error objects
    :return: a 200 Response
    """
    data = {
        'status': 400 if errors else 200,
        'data': data,
        'errors': errors,
    }
    return Response(data)


def generate_code():
    """
    Generates a new user confirmation code that can be emailed to a user
    :return: the string with the code
    """
    return \
        get_random_string(length=4, allowed_chars=CODE_ALLOWED_CHARS) + \
        '-' + \
        get_random_string(length=4, allowed_chars=CODE_ALLOWED_CHARS)


def generate_hash():
    """
    Generates a long user hash that the user is not expected to type in
    :return: the string with the hash
    """
    allowed_chars = string.ascii_letters+string.digits
    return get_random_string(length=32, allowed_chars=allowed_chars)


def codes_match(guess, actual):
    """
    Verify if the code is correct.  We will be a bit flexible on this.
    :param guess: guess at the code
    :param actual: real code
    :return: True if the codes match
    """
    return clean_code(guess) == clean_code(actual)


def clean_code(code):
    """Return a code normalized for compare"""
    return code.replace('-', '').replace(' ', '').upper().strip()


def is_number(val):
    """
    :return: true if val is a number or numeric false otherwise
    """
    return isinstance(val, (int, float, complex)) and not isinstance(val, bool)
