# Copyright (c) 2024, goshala and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class GoMaster(Document):
	pass

import frappe

@frappe.whitelist()
def fetch_go_master_list():
    # Fetch data from the Go Master doctype
    go_master_list = frappe.get_all('Go Master', filters={"current_type":"Dujani"}, fields=['name'])
    return [go.name for go in go_master_list]

@frappe.whitelist()
def fetch_customer_list():
    # Fetch data from the Customer doctype including 'morning_qty' field
    customer_list = frappe.get_all('Customer', filters={}, fields=['name','custom_morning_qty','custom_evening_qty','custom_pick_up','custom_delivery_man','custom_pickup_counter'])
    return [{'name': cus.name, 'morning_qty': cus.custom_morning_qty, 'evening_qty':cus.custom_evening_qty, 'pick_up':cus.custom_pick_up, 'delivery_man':cus.custom_delivery_man, 'pickup_counter':cus.custom_pickup_counter} for cus in customer_list]

