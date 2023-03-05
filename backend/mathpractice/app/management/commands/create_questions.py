from django.core.management.base import BaseCommand

from app.constants import INPUT_TYPE_POSITIVE_INTEGER
from app.models import Category, Question


class Command(BaseCommand):
    help = (
        "Creates questions in the database"
        "Usage: python manage.py create_questions "
    )

    def handle(self, *args, **options):

        add10 = Category.objects.filter(name='Add 10').first()
        if not add10:
            add10 = Category.objects.create(name='Add 10', description='Addition up to 10', timeout_ms=10000, mastery_count=10)
            print(f'\nCreated category {add10}')
        for a in range(0, 11):
            for b in range(0, 11):
                if (a + b) <= 10:
                    text = f'{a} + {b}'
                    answer = str(a + b)
                    create_question(add10, text, answer, INPUT_TYPE_POSITIVE_INTEGER)

        add20 = Category.objects.filter(name='Add 20').first()
        if not add20:
            add20 = Category.objects.create(name='Add 20', description='Addition from 11 to 20', timeout_ms=10000, mastery_count=10)
            add20.deps.add(add10)
            print(f'\nCreated category {add20}')
        for a in range(1, 20):
            for b in range(1, 20):
                answer = a + b
                if 10 < answer <= 20:
                    text = f'{a} + {b}'
                    create_question(add20, text, str(answer), INPUT_TYPE_POSITIVE_INTEGER)

        sub10 = Category.objects.filter(name='Sub 10').first()
        if not sub10:
            sub10 = Category.objects.create(name='Sub 10', description='Subtraction up to 10', timeout_ms=10000, mastery_count=10)
            sub10.deps.add(add10)
            print(f'\nCreated category {sub10}')
        for a in range(1, 11):
            for b in range(1, 11):
                answer = a - b
                if answer >= 0:
                    text = f'{a} - {b}'
                    create_question(sub10, text, str(answer), INPUT_TYPE_POSITIVE_INTEGER)

        sub20 = Category.objects.filter(name='Sub 20').first()
        if not sub20:
            sub20 = Category.objects.create(name='Sub 20', description='Subtraction up to 20', timeout_ms=10000, mastery_count=10)
            sub20.deps.add(sub10)
            sub20.deps.add(add20)
            print(f'\nCreated category {sub20}')
        for a in range(11, 20):
            for b in range(1, 20):
                answer = a - b
                if answer > 0:
                    text = f'{a} - {b}'
                    create_question(sub20, text, str(answer), INPUT_TYPE_POSITIVE_INTEGER)

        mul12 = Category.objects.filter(name='Mul 12').first()
        if not mul12:
            mul12 = Category.objects.create(name='Mul 12', description='Multiplication up to 12 x 12', timeout_ms=10000, mastery_count=10)
            mul12.deps.add(add10)
            print(f'\nCreated category {mul12}')
        for a in range(1, 13):
            for b in range(1, 13):
                answer = a * b
                text = f'{a} × {b}'
                create_question(mul12, text, str(answer), INPUT_TYPE_POSITIVE_INTEGER)

        div12 = Category.objects.filter(name='Div 12').first()
        if not div12:
            div12 = Category.objects.create(name='Div 12', description='Division with quotient up to 12', timeout_ms=10000, mastery_count=10)
            div12.deps.add(mul12)
            print(f'\nCreated category {div12}')
        for a in range(1, 13):
            for b in range(1, 13):
                answer = a
                text = f'{a * b} ÷ {b}'
                create_question(div12, text, str(answer), INPUT_TYPE_POSITIVE_INTEGER)


def create_question(category, text, correct_answer, input_type):
    """
    Creates a question - checking if it already exists
    """
    if not Question.objects.filter(text=text):
        question = Question.objects.create(category=category, text=text, correct_answer=correct_answer, input_type=input_type)
        print(f'Created question {question}')
