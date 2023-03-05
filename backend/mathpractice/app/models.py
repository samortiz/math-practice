from django.contrib.auth.models import PermissionsMixin, BaseUserManager, AbstractUser
from django.db import models

from app.constants import MASTERY_STATUS_INCOMPLETE, SESSION_STATUS_ACTIVE


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


class Category(models.Model):
    name = models.TextField(null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    timeout_ms = models.IntegerField(null=False, blank=False, default=0)
    mastery_count = models.IntegerField(null=False, blank=False, default=0)
    deps = models.ManyToManyField('self', symmetrical=False)  # Dependencies for hierarchy

    def __str__(self):
        return f'Category id={self.id} {self.name} description={self.description}'


class Question(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=False, blank=False)
    text = models.TextField(null=False, blank=False)
    correct_answer = models.TextField(null=False, blank=False)
    input_type = models.TextField(null=False, blank=False)  # see constants.py INPUT_TYPE_*

    def __str__(self):
        return f'Question id={self.id} {self.text} correct_answer={self.correct_answer} input_type={self.input_type}'


class Session(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    categories = models.ManyToManyField(Category)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    duration_ms = models.IntegerField(null=True, blank=True)
    active = models.BooleanField(default=True, db_index=True)
    session_status = models.TextField(null=False, blank=False, default=SESSION_STATUS_ACTIVE, db_index=True)

    def __str__(self):
        return f'Session id={self.id} user={self.user.username} active={self.active} session_status={self.session_status}'


class Answer(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, null=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=False, blank=False)
    create_date = models.DateTimeField(auto_now_add=True)
    answer = models.TextField(null=True, blank=True)
    time_ms = models.IntegerField(null=False, blank=False)
    answer_status = models.TextField(null=False, blank=False, db_index=True)

    def __str__(self):
        return f'Answer id={self.id} session={self.session} answer={self.answer} create_date={self.create_date} ' \
               f'time_ms={self.time_ms} answer_status={self.answer_status}'


class CategoryMastery(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=False, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    long_time = models.IntegerField(null=True, blank=True)
    long_accuracy = models.IntegerField(null=True, blank=True)
    short_time = models.IntegerField(null=True, blank=True)
    short_accuracy = models.IntegerField(null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)
    mastery_status = models.TextField(null=False, blank=False, db_index=True)

    def __str__(self):
        return f'CategoryMastery id={self.id} user={self.user} score={self.score} mastery_status={self.mastery_status}'
