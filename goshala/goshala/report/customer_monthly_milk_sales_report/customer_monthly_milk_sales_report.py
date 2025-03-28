# Copyright (c) 2024, goshala and contributors
# For license information, please see license.txt

import frappe


def execute(filters=None):
    columns, data = [], []

    columns = [
        {
            "label": "Customer Name",
            "fieldname": "customer_name",
            "fieldtype": "Data",
            "width": 200,
        },
        {
            "label": "Gujarati Name",
            "fieldname": "gujarati_name",
            "fieldtype": "Data",
            "width": 200,
        },
        {
            "label": "Pickup Counter",
            "fieldname": "pickup_counter",
            "fieldtype": "Data",
            "width": 150,
        },
        {
            "label": "Delivery Man",
            "fieldname": "delivery_man",
            "fieldtype": "Data",
            "width": 200,
        },
        {
			"label":"Shift",
			"fieldname":"shift",
			"fieldtype":"Data",
            "width": 100,
		},
        {
            "label": "Morning Qty",
            "fieldname": "morning_qty",
            "fieldtype": "Float",
            "width": 100,
        },
        {
            "label": "Evening Qty",
            "fieldname": "evening_qty",
            "fieldtype": "Float",
            "width": 100,
        },
        {
            "label": "Total Qty",
            "fieldname": "total_qty",
            "fieldtype": "Float",
            "width": 100,
        }
    ]

    sql = """
        SELECT
            sed.custom_customer_name AS customer_name,
            MAX(sed.custom_gujarati_name) AS gujarati_name,
            MAX(sed.custom_pickup_counter) AS pickup_counter,
            MAX(sed.custom_delivery_man) AS delivery_man,
            MAX(sed.custom_shift) AS shift,
            SUM(sed.custom_morning_qty) AS morning_qty,
            SUM(sed.custom_evening_qty) AS evening_qty,
            SUM(sed.custom_morning_qty + sed.custom_evening_qty) AS total_qty
        FROM
            `tabStock Entry Detail` sed
        JOIN
            `tabStock Entry` se ON se.name = sed.parent
        WHERE
            se.stock_entry_type = 'Milk Sales'
    """

    conditions = []
    sql_args = []

    if filters.get("from_date"):
        conditions.append("se.posting_date >= %s")
        sql_args.append(filters.get("from_date"))

    if filters.get("to_date"):
        conditions.append("se.posting_date <= %s")
        sql_args.append(filters.get("to_date"))
        
    if filters.get("customer_name"):
        conditions.append("sed.custom_customer_name = %s")
        sql_args.append(filters.get("customer_name"))

    if conditions:
        sql += " AND " + " AND ".join(conditions)

    sql += """
        GROUP BY sed.custom_customer_name
        ORDER BY customer_name ASC
    """

    data = frappe.db.sql(sql, tuple(sql_args), as_dict=True)

    return columns, data
