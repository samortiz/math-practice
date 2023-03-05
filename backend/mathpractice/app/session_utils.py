from django.db.models import Q

from app.models import Question, Answer


def get_answer_display(answer):
    """
    UI view of an answer
    """
    return {
        'answer_id': answer.id,
        'create_date': answer.create_date,
        'answer': answer.answer,
        'time_ms': answer.time_ms,
        'answer_status': answer.answer_status,
        'question_id': answer.question_id,
        'session_id': answer.session_id,
    }


def get_session_display(session, user):
    """
    UI display of a session, including all the questions
    :param session: DB object
    :param user: logged in user (used for stats)
    :return: a session object to display in the UI
    """
    db_categories = session.categories.all()
    categories = []
    for category in db_categories:
        categories.append({
            'category_id': category.id,
            'name': category.name,
            'description': category.description,
            'timeout_ms': category.timeout_ms,
            'mastery_count': category.mastery_count,
            })
    questions = Question.objects.filter(category__in=db_categories).all()
    questions_display = []
    all_answers = Answer.objects.filter(Q(session__user=user) & ~Q(session=session)).order_by('-id').all()

    for question in questions:
        question_answers = [get_answer_display(a) for a in all_answers if a.question_id == question.id]
        questions_display.append({
            'question_id': question.id,
            'text': question.text,
            'correct_answer': question.correct_answer,
            'input_type': question.input_type,
            'answers': question_answers,
            'category_id': question.category_id,
        })

    answers = Answer.objects.filter(session=session).order_by('-id').all()
    answers_display = []
    for answer in answers:
        answers_display.append(get_answer_display(answer))
    display = {
        'session_id': session.id,
        'categories': categories,
        'start_time': session.start_time,
        'end_time': session.end_time,
        'duration_ms': session.duration_ms,
        'questions': questions_display,
        'answers': answers_display,
    }
    return display
