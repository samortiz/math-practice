from django.utils import timezone
from rest_framework.decorators import api_view

from app.constants import ANSWER_STATUS_TIMEOUT, ANSWER_STATUS_CORRECT, ANSWER_STATUS_WRONG, SESSION_STATUS_ACTIVE, SESSION_STATUS_PASS
from app.misc_utils import response_with_data_and_errors, get_key, is_number, response_with_errors
from app.models import Category, Session, Question, Answer
from app.session_utils import get_session_display, get_answer_display


@api_view(('POST',))
def get_or_create_session(request):
    """
    Creates a new session and returns a display object with all the questions
    """
    session_display = {}
    errors = []
    user = request.user
    categoryIds = get_key(request.data, 'categories', [])
    categories = []
    if categoryIds:
        categories = Category.objects.filter(id__in=categoryIds).all()
    if not categories:
        errors.append({'message': 'Unable to find categories', 'fields': ['categories']})
    if not errors:
        session = None
        # Try to find an existing session
        sessions = Session.objects.filter(user=user, active=True).order_by('-id').all()
        for session_db in sessions:
            foundCategoryIds = [c.id for c in session_db.categories.all()]
            allCatsMatch = len(categoryIds) == len(foundCategoryIds)
            if allCatsMatch:
                for catId in foundCategoryIds:
                    if catId not in categoryIds:
                        allCatsMatch = False
            if allCatsMatch:
                session = session_db
                print(f'found session {session}')
                break
        if not session:
            # No existing session found we will create a new one
            session = Session.objects.create(user=user, start_time=timezone.now(), active=True, session_status=SESSION_STATUS_ACTIVE)
            for category in categories:
                session.categories.add(category)
        session_display = get_session_display(session, user)
    return response_with_data_and_errors(session_display, errors)


@api_view(('POST',))
def end_session(request):
    """
    Ends a session. Closing it and setting the status
    """
    errors = []
    user = request.user
    session_id = get_key(request.data, 'session_id', '')
    if not session_id:
        errors.append({'message': 'No session_id specified.', 'fields': ['']})
    session = None
    if not errors:
        session = Session.objects.filter(id=session_id, user=user, active=True).first()
        if not session:
            errors.append({'message': 'No session found.', 'fields': ['']})
    if not errors and session:
        end_time = timezone.now()
        duration_ms = round((end_time - session.start_time).total_seconds() * 1000)
        status = SESSION_STATUS_PASS  # TODO calculate pass/fail
        session.end_time = timezone.now()
        session.duration_ms = duration_ms
        session.session_status = status
        session.active = False
        session.save()
        print('saving session')

    return response_with_errors(errors)


@api_view(('POST',))
def create_answer(request):
    """
    Creates an answer in a session
    """
    data = None
    errors = []
    user = request.user
    session_id = get_key(request.data, 'session_id', '')
    question_id = get_key(request.data, 'question_id', '')
    answer = get_key(request.data, 'answer', '')
    time_ms = get_key(request.data, 'time_ms', 0)
    answer_status = get_key(request.data, 'answer_status', ANSWER_STATUS_TIMEOUT)

    session = None
    if not session_id:
        errors.append({'message': 'You must pass a session_id', 'fields': ['session_id']})
    if not errors:
        session = Session.objects.filter(id=session_id, user=user).first()
    if not errors and not session:
        errors.append({'message': 'Unable to find session', 'fields': ['session_id']})

    question = None
    if not question_id:
        errors.append({'message': 'You must provide a question_id', 'fields': ['question_id']})
    if not errors:
        question = Question.objects.filter(id=question_id).first()
    if not errors and not question:
        errors.append({'message': 'Unable to find question', 'fields': ['question_id']})

    if not time_ms or not is_number(time_ms):
        errors.append({'message': 'time_ms is a required number', 'fields': ['time_ms']})

    real_answer_status = ANSWER_STATUS_CORRECT if question.correct_answer == answer else ANSWER_STATUS_WRONG

    if answer_status == ANSWER_STATUS_TIMEOUT:
        real_answer_status = ANSWER_STATUS_TIMEOUT
        time_ms = question.category.timeout_ms

    if not errors:
        answer_db = Answer.objects.create(
            session=session,
            question=question,
            answer=answer,
            time_ms=time_ms,
            answer_status=real_answer_status)
        data = get_answer_display(answer_db)
        print(f'Stored answer {answer_db}')
    return response_with_data_and_errors(data, errors)
