import frappe
import datetime
from dateutil.relativedelta import relativedelta

@frappe.whitelist(allow_guest=True)
def change_go_type():
    today = datetime.date.today()
    go = frappe.db.get_list('Go Master', filters={'gender':'Female', 'current_type':'Vachhardi'}, fields=['name', 'current_type', 'birth_date_time'])
        
    for entry in go:
        # Convert birth_date_time to a date string
        birth_date = entry['birth_date_time'].strftime('%Y-%m-%d')
        birth_date_obj = datetime.datetime.strptime(birth_date, '%Y-%m-%d').date()
        date_after_7_months = birth_date_obj + relativedelta(months=7)
        
        if today == date_after_7_months:
            # If they are the same, set 'current_type' as "Dujani"
            frappe.db.set_value('Go Master', entry['name'], 'current_type', 'Dujani')
            frappe.db.commit()
       