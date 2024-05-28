import frappe

def execute(filters=None):
    columns, data = [], []

    columns = [
        {
            "label": "Date",
            "fieldname": "date",
            "fieldtype": "Date",
            "width": 200,
        },
        
        {
			"label":"Go Name",
			"fieldname":"go_name",
			"fieldtype":"Data",
            "width": 200,
		},
         
        {
            "label": "Morning Qty",
            "fieldname": "morning_qty",
            "fieldtype": "Float",
            "width": 200,
        },
        
        {
            "label": "Evening Qty",
            "fieldname": "evening_qty",
            "fieldtype": "Float",
            "width": 200,
        },
        
        {
            "label": "Total Qty",
            "fieldname": "total_qty",
            "fieldtype": "Float",
            "width": 200,
        }
    ]

    sql = """
        SELECT
            se.posting_date AS date,
            sed.custom_go_name AS go_name,
			sed.custom_tag_number AS tag_no,
            sed.custom_morning_qty AS morning_qty,
            sed.custom_evening_qty AS evening_qty,
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

    if filters.get("from_date"):
        conditions.append("se.posting_date >= %s")
        sql_args.append(filters.get("from_date"))

    if filters.get("to_date"):
        conditions.append("se.posting_date <= %s")
        sql_args.append(filters.get("to_date"))
        
         
    if filters.get("tag_no"):  # Add filter for tag_no
        conditions.append("sed.custom_tag_number = %s")
        sql_args.append(filters.get("tag_no"))    
    
          

    if conditions:
        sql += " AND " + " AND ".join(conditions)

    sql += """
        GROUP BY se.posting_date, sed.custom_tag_number
        ORDER BY se.posting_date
    """

    data = frappe.db.sql(sql, tuple(sql_args), as_dict=True)

    return columns, data