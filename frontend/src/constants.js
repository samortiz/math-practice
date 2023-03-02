export const SUPPORT_EMAIL = 'admin@conferences-usacm.org';

// Used to detect development servers running on localhost
export const LOCAL_HOSTS = {
  'http://localhost:3000': 'http://localhost:8000',
  'http://127.0.0.1:3000': 'http://127.0.0.1:8000',
  'http://192.168.2.23:3000': 'http://192.168.2.23:8000',  // put your local IP here (also add to CORS_ALLOWED_ORIGINS in .env)
};

// These need to match the server-side permissions in models.py (see constants.py)
export const PERMISSION_STAFF = 'staff';
export const PERMISSION_CONF_ADMIN = 'conf_admin';
export const PERMISSION_CONF_ORGANIZER = 'conf_organizer';
export const PERMISSION_CALC_ABSTRACT_SUBMITTER = "abstract_submitter";
export const PERMISSION_CALC_SYMPOSIUM_SUBMITTER = "symposium_submitter";
export const PERMISSION_CALC_SYMPOSIUM_MAIN_ORGANIZER = "symposium_main_organizer";
export const PERMISSION_CALC_SYMPOSIUM_ORGANIZER = "symposium_organizer";
// Display names for the permissions
export const PERMISSION_NAMES = {
  [PERMISSION_STAFF]: "Staff",
  [PERMISSION_CONF_ADMIN]: "Conference Admin",
  [PERMISSION_CONF_ORGANIZER]: "Conference Organizer",
  [PERMISSION_CALC_ABSTRACT_SUBMITTER]: "Abstract Submitter",
  [PERMISSION_CALC_SYMPOSIUM_SUBMITTER]: "Symposium Submitter",
  [PERMISSION_CALC_SYMPOSIUM_MAIN_ORGANIZER]: "Symposium Main Organizer",
  [PERMISSION_CALC_SYMPOSIUM_ORGANIZER]: "Symposium Organizer",
};
// Non editable permissions - calculated based on data
export const CALCULATED_PERMISSIONS = [
  PERMISSION_CALC_ABSTRACT_SUBMITTER,
  PERMISSION_CALC_SYMPOSIUM_SUBMITTER,
  PERMISSION_CALC_SYMPOSIUM_MAIN_ORGANIZER,
  PERMISSION_CALC_SYMPOSIUM_ORGANIZER,
];
export const ALL_PERMISSIONS = Object.keys(PERMISSION_NAMES);

// These to match the server-side values in constants.py
export const CONF_LABEL_KEY_CONFERENCE = "conference";
export const CONF_LABEL_KEY_SYMPOSIUM = "symposium";
export const CONF_LABEL_KEY_EMPHASIS_AREAS = "emphasis_areas";
export const CONF_LABEL_KEY_LOCATION = "location";
export const CONF_LABEL_KEY_SUBMIT_ABSTRACT_CONTENT = "submit_abstract_content";
export const CONF_LABEL_KEY_SUBMIT_ABSTRACT_EARLY_CONTENT = "submit_abstract_early_content";
export const CONF_LABEL_KEY_SUBMIT_ABSTRACT_EXPIRED_CONTENT = "submit_abstract_expired_content";
export const CONF_LABEL_KEY_PROPOSE_SYMPOSIUM_CONTENT = "propose_symposium_content";
export const CONF_LABEL_KEY_PROPOSE_SYMPOSIUM_EXPIRED_CONTENT = "propose_symposium_expired_content";
export const CONF_LABEL_KEY_PROPOSE_SYMPOSIUM_RECEIVED_CONTENT = "propose_symposium_received_content";
export const CONF_LABEL_KEY_SCHEDULING_INSTRUCTIONS_CONTENT = "scheduling_instructions";
export const CONF_LABEL_KEY_FAQ_CONTENT = "faq_content";
export const CONF_LABEL_KEY_ORG_INFO_CONTENT = "org_info_content";

// These should match the values in backend constants.py
export const CONF_LABEL_TYPE_TEXT = "text";
export const CONF_LABEL_TYPE_HTML = "html";
export const CONF_LABEL_TYPE_ABSTRACT_STATUS = "abstract_status";
export const CONF_LABEL_TYPE_SYMPOSIUM_STATUS = "symposium_status";
export const CONF_LABEL_TYPE_FLAG = "flag";


// These should match the server-side values in constants.py
export const FLAG_ABSTRACT_FINAL_APPROVED = "abstract_final_approved";
export const FLAG_ABSTRACT_FINAL_DENIED = "abstract_final_denied";
export const FLAG_ABSTRACT_MOVE = "abstract_move";
export const FLAG_ABSTRACT_ARCHIVED = "abstract_archived";
export const FLAG_SYMPOSIUM_ARCHIVED = "symposium_archived";
export const FLAG_SYMPOSIUM_APPROVED_EMAIL_SENT = "symposium_approved_email_sent";

// These should match the values in backend constants.py
export const SYMPOSIUM_STATUS_PENDING = "symposium_pending";
export const SYMPOSIUM_STATUS_APPROVED = "symposium_approved";
export const SYMPOSIUM_STATUS_DENIED = "symposium_denied";
export const SYMPOSIUM_STATUSES = [
  SYMPOSIUM_STATUS_PENDING,
  SYMPOSIUM_STATUS_APPROVED,
  SYMPOSIUM_STATUS_DENIED,
];

export const SYMPOSIUM_FILTER_DEFAULT_STATE = [
  {type: 'all', key: 'all', showing: false},
  {type: CONF_LABEL_TYPE_SYMPOSIUM_STATUS, key: SYMPOSIUM_STATUS_PENDING, showing: true},
  {type: CONF_LABEL_TYPE_SYMPOSIUM_STATUS, key: SYMPOSIUM_STATUS_APPROVED, showing: true},
  {type: CONF_LABEL_TYPE_FLAG, key: FLAG_SYMPOSIUM_APPROVED_EMAIL_SENT, showing: true},
  {type: CONF_LABEL_TYPE_SYMPOSIUM_STATUS, key: SYMPOSIUM_STATUS_DENIED, showing: false},
  {type: CONF_LABEL_TYPE_FLAG, key: FLAG_SYMPOSIUM_ARCHIVED, showing: false},
];

// These should match the server-side values in constants.py
export const ABSTRACT_STATUS_PENDING = "abstract_pending";
export const ABSTRACT_STATUS_APPROVED = "abstract_approved";
export const ABSTRACT_STATUS_DENIED = "abstract_denied";

export const ABSTRACT_FILTER_DEFAULT_STATE = [
  {type: 'all', key: 'all', showing: false},
  {type: CONF_LABEL_TYPE_ABSTRACT_STATUS, key: ABSTRACT_STATUS_PENDING, showing: true},
  {type: CONF_LABEL_TYPE_ABSTRACT_STATUS, key: ABSTRACT_STATUS_APPROVED, showing: true},
  {type: CONF_LABEL_TYPE_ABSTRACT_STATUS, key: ABSTRACT_STATUS_DENIED, showing: false},
  {type: CONF_LABEL_TYPE_FLAG, key: FLAG_ABSTRACT_FINAL_APPROVED, showing: true},
  {type: CONF_LABEL_TYPE_FLAG, key: FLAG_ABSTRACT_FINAL_DENIED, showing: false},
  {type: CONF_LABEL_TYPE_FLAG, key: FLAG_ABSTRACT_MOVE, showing: false},
  {type: CONF_LABEL_TYPE_FLAG, key: FLAG_ABSTRACT_ARCHIVED, showing: false},
];

export const ABSTRACT_MAX_TEXT_WORDS = 400;
export const ABSTRACT_PRESENTATION_TYPE_ORAL = 'oral';
export const ABSTRACT_PRESENTATION_TYPE_POSTER = 'poster';

export const ICON_ARCHIVED = 'circle-minus';
export const ICON_MOVE = 'circle-right';

export const COLOR_PENDING = '#FF7F50';
export const COLOR_APPROVED = '#32CD32';
export const COLOR_MOVE = '#9932CC';
export const COLOR_DENIED = '#708090';
export const COLOR_ARCHIVED = '#2F4F4F';

// General mode for list components
export const MODE_LIST = 'list';
export const MODE_EDIT = 'edit';
export const MODE_VIEW = 'view';
export const MODE_APPROVE = 'approve';
export const MODE_SCHEDULE = 'schedule';

export const AFFILIATION_SEPARATOR = " ~ "

export const TRACKING_TYPE_ME = "me";
export const TRACKING_TYPE_LOGIN = "login";
export const TRACKING_TYPE_LOGIN_ERROR = "login error";
export const TRACKING_TYPE_LOGOUT = "logout";
export const TRACKING_TYPE_REGISTER = "register";
export const TRACKING_TYPE_REGISTER_ERROR = "register error";
export const TRACKING_TYPE_USER_PROFILE_UPDATE = "user profile update";
export const TRACKING_TYPE_USER_CHANGE_PASSWORD = "user change password";
export const TRACKING_TYPE_USER_CHANGE_PASSWORD_ERRORS = "user change password errors";
export const TRACKING_TYPE_VERIFY_EMAIL = "verify email";
export const TRACKING_TYPE_FORGOT_PASSWORD_ERROR = "forgot password error";
export const TRACKING_TYPE_PASSWORD_RESET = "password reset";
export const TRACKING_TYPE_PASSWORD_RESET_ERROR = "password reset error";
export const TRACKING_TYPE_IMPERSONATE_USER = "impersonate user";
export const TRACKING_TYPE_EMAIL_SENT = "email sent";
export const TRACKING_TYPE_EMAIL_SENT_ERROR = "email sent error";
export const TRACKING_TYPE_UPDATE_USER_ROLES = "update user roles";
export const TRACKING_TYPE_CREATE_CONF = "create conf";
export const TRACKING_TYPE_CONF_UPDATE_GENERAL = "conf update general";
export const TRACKING_TYPE_CONF_UPDATE_THEME = "conf update theme";
export const TRACKING_TYPE_CONF_UPDATE_ABSTRACT = "conf update abstract";
export const TRACKING_TYPE_CONF_UPDATE_LISTS = "conf update lists";
export const TRACKING_TYPE_CONF_UPDATE_LABEL = "conf update label";
export const TRACKING_TYPE_CONF_UPDATE_EMAIL = "conf update email";
export const TRACKING_TYPE_SYMPOSIUM_CREATE = "symposium create";
export const TRACKING_TYPE_SYMPOSIUM_UPDATE = "symposium update";
export const TRACKING_TYPE_SYMPOSIUM_ARCHIVE = "symposium archive";
export const TRACKING_TYPE_ABSTRACT_CREATE = "abstract create";
export const TRACKING_TYPE_ABSTRACT_UPDATE = "abstract update";
export const TRACKING_TYPE_ABSTRACT_UPDATE_STATUS = "abstract update status";
export const TRACKING_TYPE_ABSTRACT_UPDATE_MOVE = "abstract update move";
export const TRACKING_TYPE_ABSTRACT_UPDATE_FINAL = "abstract update final";
export const TRACKING_TYPE_ABSTRACT_UPDATE_ARCHIVED = "abstract update archived";
export const TRACKING_TYPE_ROOM_CREATE = "room create";
export const TRACKING_TYPE_ROOM_UPDATE = "room update";
export const TRACKING_TYPE_ROOM_DELETE = "room delete";
export const TRACKING_TYPE_SESSION_CREATE = "session create";
export const TRACKING_TYPE_SESSION_UPDATE = "session update";
export const TRACKING_TYPE_SESSION_DELETE = "session delete";
export const TRACKING_TYPE_TIMESLOT_CREATE = "timeslot create";
export const TRACKING_TYPE_TIMESLOT_UPDATE = "timeslot update";
export const TRACKING_TYPE_TIMESLOT_DELETE = "timeslot delete";
export const TRACKING_TYPE_CHAIR_UPDATE = "chair update";
export const TRACKING_TYPE_ROOMSESSION_UPSERT = "roomsession upsert";
export const TRACKING_TYPE_ROOMSESSION_DOWNLOAD_EXCEL = "roomsession download excel";
export const TRACKING_TYPE_ROOMSESSION_UPLOAD_EXCEL = "roomsession upload excel";
export const TRACKING_TYPE_ROOMSESSION_UPLOAD_EXCEL_ERROR = "roomsession upload excel error";
export const TRACKING_TYPE_ROOMSESSIONTIMESLOT_UPSERT = "roomsessiontimeslot upsert";
