from django.contrib.auth.models import PermissionsMixin, BaseUserManager, AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_custom_user(self, username, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError("email is required")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_custom_user(username, email, password, **extra_fields)


class User(AbstractUser, PermissionsMixin):
    username = models.TextField(unique=True, null=False, blank=False, db_index=True)
    email = models.TextField(unique=True, null=False, blank=False, db_index=True)
    first_name = models.TextField(null=True, blank=True)
    last_name = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)  # used to soft delete users
    objects = UserManager()

    def __str__(self):
        return f'User {self.first_name} {self.last_name} id={self.id} username={self.username} email={self.email}'


