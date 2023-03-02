import re

from django.contrib.auth import get_user_model
from django.contrib.auth.models import update_last_login
from django.contrib.auth.password_validation import MinimumLengthValidator, CommonPasswordValidator, NumericPasswordValidator
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from rest_framework.authtoken.models import Token


def generate_user_token(user, errors, request):
    """
    Generates a token for the user (or re-uses an existing one).  This is the user logging in.
    :param user:  user the token is for
    :param errors: any problems will be stored here
    :param request: http request used to get the conf
    :return: the token as a string
    """
    [token, created] = Token.objects.get_or_create(user=user)
    token_str = str(token)
    if not token_str:
        errors.append({'message': 'Server error generating token.', 'fields': []})
    if not errors:
        update_last_login(None, token.user)
    return token_str


def validate_username(username, errors, field_name):
    """
    Validates the username. Errors are stored in errors array
    :param username: string being validated
    :param errors: array of error messages
    :param field_name: name to use for field in errors
    """
    username_clean = re.sub(r'[^a-zA-Z0-9_.+@]', '', username)
    if username_clean != username:
        errors.append({
            'message': f'The username "{username}" contains invalid characters. Please only use letters, numbers and underscore.',
            'fields': [field_name]})

    # Check that the user doesn't already exist in the DB
    User = get_user_model()
    found_user = User.objects.filter(username=username_clean)
    if found_user:
        errors.append({'message': 'A user already exists with that username. Please try a different one.',
                       'fields': [field_name]})


def validate_email(email, errors, field_name, validate_unique):
    """
    Validates an email address. Errors are stored in errors array
    :param email: string being validated
    :param errors: array of error messages
    :param field_name: name to use for field in errors
    :param validate_unique: display error if the email is already used
    """
    try:
        EmailValidator().__call__(email)
    except ValidationError as e:
        message = ""
        for error in e.messages:
            message += str(error)
        errors.append({'message': message,
                       'fields': [field_name]})

    # Check if the email already exists in the DB
    if validate_unique:
        User = get_user_model()
        found_user = User.objects.filter(email=email)
        if found_user:
            errors.append({'message': 'A user already exists with that email. Please try a different one.',
                           'fields': [field_name]})


def validate_password(password, errors, field_name):
    """
    Validates the password. Errors are stored in errors array
    :param password: string being validated
    :param errors: array of error messages
    :param field_name: name to use for field in errors
    """
    passwordValidators = [MinimumLengthValidator, CommonPasswordValidator, NumericPasswordValidator]
    for validator in passwordValidators:
        try:
            validator().validate(password)
        except ValidationError as e:
            message = ""
            for error in e.messages:
                message += str(error)
            errors.append({'message': message,
                           'fields': [field_name]})


def validate_first_name(first_name, errors, field_name):
    """
    Validates first name
    :param first_name: string being validated
    :param errors: array of error messages
    :param field_name: name to use for field in errors
    """
    if not first_name:
        errors.append({'message': 'You must enter a first name.',
                       'fields': [field_name]})


def validate_last_name(last_name, errors, field_name):
    """
    Validates last name
    :param last_name: string being validated
    :param errors: array of error messages
    :param field_name: name to use for field in errors
    """
    if not last_name:
        errors.append({'message': 'You must enter a last name.',
                       'fields': [field_name]})
