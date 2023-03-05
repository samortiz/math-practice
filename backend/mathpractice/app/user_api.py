from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view

from app.misc_utils import get_key, response_with_data_and_errors, response_with_errors
from app.user_utils import generate_user_token, validate_username, validate_email, validate_password, validate_first_name, \
    validate_last_name, get_mastery
from app.decorators import allow_everyone


@api_view(('POST',))
@allow_everyone()
def register(request):
    """
    Create a new user
    """
    errors = []  # {field:"username", message:"Too long"}
    username = get_key(request.data, 'username', '').lower()  # usernames are all lowercase
    email = get_key(request.data, 'email', '').lower()  # email are all lowercase
    password = get_key(request.data, 'password', '')
    password_confirm = get_key(request.data, 'password_confirm', '')
    first_name = get_key(request.data, 'first_name', '')
    last_name = get_key(request.data, 'last_name', '')

    validate_username(username, errors, 'username')
    validate_email(email, errors, 'email', validate_unique=True)
    validate_password(password, errors, 'password')

    # Validate the password confirm
    if password != password_confirm:
        errors.append({'message': 'The confirm password does not match.',
                       'fields': ['passwordconfirm']})

    validate_first_name(first_name, errors, 'first_name')
    validate_last_name(last_name, errors, 'last_name')

    if not errors:
        new_user = get_user_model().objects.create_custom_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name)
        new_user.save()
    return response_with_errors(errors)


@api_view(('POST',))
@allow_everyone()
def login(request):
    """
    Logs the user in, this will accept a username or an email and looks up the appropriate user
    """
    errors = []
    data = {}
    username_email = get_key(request.data, 'username_email', '').lower()  # username or email
    password = get_key(request.data, 'password', '')

    if not username_email:
        errors.append({'message': 'You must enter a username/email. ', 'fields': []})

    if not password:
        errors.append({'message': 'You must enter a password. ', 'fields': []})

    # Get the user from the DB
    user = get_user_model().objects.filter(username=username_email).first()
    if not user:
        # Try matching on email
        user = get_user_model().objects.filter(email=username_email).first()
    if not user:
        errors.append({'message': 'Could not find user.', 'fields': []})
        user = None

    # Check the password supplied
    if user and not user.check_password(password):
        errors.append({'message': 'Your password is incorrect. ', 'fields': []})

    if user and not user.is_active:
        errors.append({'message': 'User is not active.', 'fields': []})

    if not errors:
        data['token'] = generate_user_token(user, errors, request)
    return response_with_data_and_errors(data, errors)


@api_view(('GET',))
def me(request):
    """
    This returns information on the currently logged in user
    """
    user = request.user
    data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'mastery': get_mastery(user)
    }
    return response_with_data_and_errors(data, [])


@api_view(('GET',))
def logout(request):
    request.user.auth_token.delete()
    return response_with_data_and_errors({}, [])
