from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = (
        "Runs some arbitrary code (you need to provide it).  This is useful for testing"
        "Usage: python manage.py run "
        "NOTE: You should remember to remove your code and not commit it to git when you're done testing."
    )

    def handle(self, *args, **options):
        print('running')
