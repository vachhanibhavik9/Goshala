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

@frappe.whitelist()
def fetch_stock_entry_data(month, year):
    # Convert month and year to integers if they are not already
    month = int(month)
    year = int(year)

    # Use zero-padding for the month to format it properly
    formatted_month = f'{month:02d}'
    
    # Construct the query to filter data based on the provided month and year
    sql_query = f"""   
        SELECT 
            DATE_FORMAT(se.posting_date, '%m-%Y') AS month_year,
            sed.custom_customer_name,
            SUM(sed.custom_morning_qty) AS total_morning_qty,
            SUM(sed.custom_evening_qty) AS total_evening_qty
        FROM 
            `tabStock Entry` AS se
        JOIN 
            `tabStock Entry Detail` AS sed ON se.name = sed.parent
        WHERE 
            se.stock_entry_type = 'Milk Sales'
            AND DATE_FORMAT(se.posting_date, '%Y-%m') = '{year}-{formatted_month}'
        GROUP BY 
            month_year, sed.custom_customer_name
    """
    
    # Fetch the data
    data = frappe.db.sql(sql_query, as_dict=True)
    
    # Return the data
    return data

