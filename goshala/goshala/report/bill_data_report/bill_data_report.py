# Copyright (c) 2024, goshala and contributors
# For license information, please see license.txt

import frappe
from datetime import datetime

def execute(filters=None):
    columns, data = [], []
    
    # Define columns
    columns = [
        {"label": "Month", "fieldname": "month", "fieldtype": "Data", "width": 100},
        {"label": "Bill No", "fieldname": "bill_no", "fieldtype": "Data", "width": 150},
        {"label": "Customer Name", "fieldname": "customer_name", "fieldtype": "Data", "width": 250},
        {"label": "Contact No", "fieldname": "contact_no", "fieldtype": "Int", "width": 120},
        {"label": "Pickup", "fieldname": "pickup", "fieldtype": "Data", "width": 120},
        {"label": "Delivery Man", "fieldname": "delivery_man", "fieldtype": "Data", "width": 150},
        {"label": "Total Quantity", "fieldname": "total_qty", "fieldtype": "Float", "width": 100},
        {"label": "Rate", "fieldname": "rate", "fieldtype": "Float", "width": 100},
        {"label": "Amount", "fieldname": "amount", "fieldtype": "Float", "width": 100},
        {"label": "Payment Status", "fieldname": "payment_status", "fieldtype": "Data", "width": 100},
        {"label": "Credit Date", "fieldname": "credit_date", "fieldtype": "Data", "width": 100}
    ]

    # Ensure filters are passed and retrieve the month_year filter
    if "month_year" in filters:
        month_year = filters.get("month_year")
        if month_year:
            # Convert date to custom month format (e.g., May-2024)
            custom_month = datetime.strptime(month_year, "%Y-%m-%d").strftime("%B-%Y")
            print(custom_month)  # This will print "May-2024"
        else:
            # Show all data because the filter is blank
            print("Showing all data")  # Replace this with the code to show all data
    else:
        frappe.throw("Month Year filter is required")

    # SQL query to fetch filtered data
    sql = """
        SELECT
            sii.custom_month AS month,
            si.name AS bill_no,
            si.customer AS customer_name,
            si.custom_contact_no AS contact_no,
            si.custom_pickup AS pickup,
            si.custom_delivery_name AS delivery_man,
            si.total_qty AS total_qty,
            sii.price_list_rate AS rate,
            si.total AS amount
        FROM
            `tabSales Invoice Item` sii
        JOIN
            `tabSales Invoice` si ON si.name = sii.parent
        WHERE
            sii.custom_month = %s
    """
    
    # Execute the SQL query with the filter value
    data = frappe.db.sql(sql, (custom_month,), as_dict=True)

    return columns, data
