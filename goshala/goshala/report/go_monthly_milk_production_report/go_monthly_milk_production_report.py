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
            "width": 200,
        },
        {
            "label": "Go Name",
            "fieldname": "go_name",
            "fieldtype": "Data",
            "width": 200,
        },
        {
            "label": "Tag No",
            "fieldname": "tag_no",
            "fieldtype": "Data",
            "width": 200,
        },
        {
            "label": "Total Morning Qty",
            "fieldname": "total_morning_qty",
            "fieldtype": "Float",
            "width": 200,
        },
        {
            "label": "Total Evening Qty",
            "fieldname": "total_evening_qty",
            "fieldtype": "Float",
            "width": 200,
        },
        {
            "label": "Total Qty",
            "fieldname": "total_qty",
            "fieldtype": "Float",
            "width": 200,
        },
    ]

    sql = """
        SELECT
            DATE_FORMAT(se.posting_date, '%%Y-%%m') AS month,
            sed.custom_go_name AS go_name,
            sed.custom_tag_number AS tag_no,
            
            SUM(sed.custom_morning_qty) AS total_morning_qty,
            SUM(sed.custom_evening_qty) AS total_evening_qty,
            SUM(sed.custom_morning_qty + sed.custom_evening_qty) AS total_qty
        FROM
            `tabStock Entry Detail` sed
        JOIN
            `tabStock Entry` se ON se.name = sed.parent
        WHERE
            se.stock_entry_type = 'Milk Production'
    """

    conditions = []
    sql_args = []

    if filters and filters.get("from_date"):
        conditions.append("se.posting_date >= %s")
        sql_args.append(filters.get("from_date"))

    if filters and filters.get("to_date"):
        conditions.append("se.posting_date <= %s")
        sql_args.append(filters.get("to_date"))

    if conditions:
        sql += " AND " + " AND ".join(conditions)

    sql += """
        GROUP BY DATE_FORMAT(se.posting_date, '%%Y-%%m'), sed.custom_go_name, sed.custom_tag_number
        ORDER BY DATE_FORMAT(se.posting_date, '%%Y-%%m')
    """

    data = frappe.db.sql(sql, tuple(sql_args), as_dict=True)

    return columns, data
