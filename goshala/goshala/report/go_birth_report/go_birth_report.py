# Copyright (c) 2024, goshala and contributors
# For license information, please see license.txt

import frappe
from datetime import datetime


def execute(filters=None):
    columns, data = [], []

    columns = [
        {
            "label": "Total Vachhardi",
            "fieldname": "total_vachhardi",
            "fieldtype": "Float",
            "width": 200,
        },
        {
            "label": "Total Vachhardo",
            "fieldname": "total_vachhardo",
            "fieldtype": "Float",
            "width": 200,
        },
        {
            "label": "Total",
            "fieldname": "total",
            "fieldtype": "Float",
            "width": 200,
        }
    ]

    conditions = []
    if filters.get("from_date"):
        conditions.append("birth_date_time >= %(from_date)s")

    if filters.get("to_date"):
        try:
            to_date = datetime.strptime(filters.get("to_date"), "%Y-%m-%d")
            # Add one day to the to_date to include the entire end date in the filter
            to_date = to_date.replace(hour=23, minute=59, second=59)
            filters["to_date"] = to_date.strftime("%Y-%m-%d %H:%M:%S")
            conditions.append("birth_date_time <= %(to_date)s")
        except ValueError:
            frappe.throw("Invalid To Date format. Please use YYYY-MM-DD.")
            
    if filters.get("goshala"):
        conditions.append("goshala_name = %(goshala)s")

    where_clause = " AND ".join(conditions) if conditions else "1=1"

    sql = f"""
        SELECT
            SUM(CASE WHEN current_type = 'Vachhardi' THEN 1 ELSE 0 END) AS total_vachhardi,
            SUM(CASE WHEN current_type = 'Vachhardo' THEN 1 ELSE 0 END) AS total_vachhardo,
            SUM(CASE WHEN current_type = 'Vachhardi' THEN 1 ELSE 0 END) +
            SUM(CASE WHEN current_type = 'Vachhardo' THEN 1 ELSE 0 END) AS total
        FROM
            `tabGo Master`
        WHERE
            enabled = 1 AND
            {where_clause}
    """

    data = frappe.db.sql(sql, filters, as_dict=True)

    return columns, data

