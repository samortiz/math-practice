from functools import wraps

from django.core.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny


def allow_everyone():
    """
    Allows access to NOT LOGGED IN users!  Be careful, there are unfriendly bots out there.
    This is a replacement for : #@permission_classes([AllowAny])
    """
    def decorator(func):
        func.permission_classes = [AllowAny]
        return func
    return decorator


def is_staff(user):
    """  Return true if the user is staff (active, is_staff, is_superuser) """
    if not user:
        return False
    return user.is_active and user.is_staff and user.is_superuser


def allow_staff():
    """
    Checks if the user is a super-user with Django's is_staff and is_superuser
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if not is_staff(request.user):
                raise PermissionDenied
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator







