# Logging utils
import logging
import sys
import traceback


def log_error(msg, error=None):
    """
    Logs an error message
    :param msg:  User supplied message giving context
    :param error: Error object thrown (optional)
    """
    if error:
        exc_info = sys.exc_info()
        error_msg = str(traceback.format_exception(*exc_info))
        logging.getLogger('app').error(f'USACM-ERROR {msg} - {str(error)} : {error_msg}')
    else:
        logging.getLogger('app').error(f'USACM-ERROR  {msg}')


def log_info(msg):
    """
    Logs an info level message
    """
    logging.getLogger('app').info(f'USACM-INFO {msg}')


def log_warning(msg):
    """
    Logs a warning message
    """
    logging.getLogger('app').warning(f'USACM-WARNING {msg}')
