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
    # Fetch data from the Go Master doctype
    customer_list = frappe.get_all('Customer', filters={}, fields=['name'])
    return [cus.name for cus in customer_list]

@frappe.whitelist()
def fetch_customer_list():
    # Fetch data from the Go Master doctype
    customer_list = frappe.get_all('Customer', filters={}, fields=['name'])
    # Modify the fields to include 'morning_qty_add'
    return [{'name': cus.name, 'morning_qty_add': get_morning_qty_add(cus.name)} for cus in customer_list]

def get_morning_qty_add(customer_name):
    # Write your logic to fetch morning_qty_add for the given customer
    # For example:
    # morning_qty_add = frappe.db.get_value('YourTable', {'customer': customer_name}, 'morning_qty_add')
    morning_qty_add = 10  # Placeholder value, replace it with your actual logic
    return morning_qty_add

