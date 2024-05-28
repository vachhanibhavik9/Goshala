# Copyright (c) 2024, goshala and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):
	columns, data = [], []
	
	columns = [
        {
            "label": "Month",
            "fieldname": "month",
            "fieldtype": "Data",
            "width": 100
        },
        
        {
			"label":"Bill No",
			"fieldname":"bill_no",
			"fieldtype":"Data",
            "width": 150
		},
         
        {
            "label": "Customer Name",
            "fieldname": "customer_name",
            "fieldtype": "Data",
            "width": 250
        },
        
        {
            "label": "Contact No",
            "fieldname": "contact_no",
            "fieldtype": "Int",
            "width": 120
        },
        
        {
            "label": "Pickup",
            "fieldname": "pickup",
            "fieldtype": "Data",
            "width": 120
        },

        {
            "label": "Delivery Man",
            "fieldname": "delivery_man",
            "fieldtype": "Data",
            "width": 150
        },

        {
            "label": "Total Quantity",
            "fieldname": "total_qty",
            "fieldtype": "Float",
            "width": 100
        },

        {
            "label": "Rate",
            "fieldname": "rate",
            "fieldtype": "Float",
            "width": 100
        },

        {
            "label": "Amount",
            "fieldname": "amount",
            "fieldtype": "Float",
            "width": 100
        },

        {
            "label": "Payment Status",
            "fieldname": "payment_status",
            "fieldtype": "Data",
            "width": 100
        },

        {
            "label": "Credit Date",
            "fieldname": "credit_date",
            "fieldtype": "Data",
            "width": 100
        }
    ]

	

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
    """
    

	data = frappe.db.sql(sql, as_dict=True)

	return columns, data
