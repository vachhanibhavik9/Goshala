import frappe
import datetime
from dateutil.relativedelta import relativedelta
from datetime import datetime

# Changes go type automatic after 7 months of born

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
       
# Fetch go master list in stock entry doctype where stock entry type is milk production

@frappe.whitelist()
def fetch_go_master_list():
    # Fetch data from the Go Master doctype
    go_master_list = frappe.get_all('Go Master', filters={"enabled":1, "goshala_name":"Shree Vallabh Goshala - Vadla", "current_type":"Dujani"}, fields=['name','tag_number'])
    
    # return [go.name for go in go_master_list]
    return [{'name': go.name, 'tag_number': go.tag_number} for go in go_master_list]

    
# Fetch customer list in stock entry doctype where stock entry type is milk sales

@frappe.whitelist()
def fetch_customer_list():
    # Fetch data from the Customer doctype including 'morning_qty' field
    customer_list = frappe.get_all('Customer', filters={'disabled': 0}, fields=['name', 'custom_gujarati_name', 'custom_shift', 'custom_morning_qty', 'custom_evening_qty', 'custom_pick_up', 'custom_delivery_man', 'custom_pickup_counter'])

    # Sort customers based on their delivery method
    # Customers with self-pickup first, then home delivery
    sorted_customer_list = sorted(customer_list, key=lambda cus: cus.custom_pick_up, reverse=True)

    # Return sorted list of customers
    return [{'name': cus.name, 'custom_shift': cus.custom_shift, 'custom_gujarati_name':cus.custom_gujarati_name, 'morning_qty': cus.custom_morning_qty, 'evening_qty': cus.custom_evening_qty, 'pick_up': cus.custom_pick_up, 'delivery_man': cus.custom_delivery_man, 'pickup_counter': cus.custom_pickup_counter} for cus in sorted_customer_list]

# Fetch customer details month wise in when create sales invoice

@frappe.whitelist()
def fetch_stock_entry_data(month, year, customer=None):
    # Convert month and year to integers if they are not already
    month = int(month)
    year = int(year)
    
    # Use zero-padding for the month to format it properly
    formatted_month = f'{month:02d}'
    
    # Construct the base query without customer filter
    base_sql_query = f"""   
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
    """
    
    # If customer is provided, add customer filter to the query
    if customer:
        sql_query = base_sql_query + f" AND sed.custom_customer_name = '{customer}'"
    else:
        sql_query = base_sql_query + " GROUP BY month_year, sed.custom_customer_name"
    
    # Fetch the data
    data = frappe.db.sql(sql_query, as_dict=True)
    
    # Iterate through the fetched data and create Sales Invoices
    for entry in data:
        create_sales_invoice(entry)
    
    # Return a success message
    return "Sales Invoices created successfully"




def create_sales_invoice(data):

    # Convert the custom_month field value from MM-YYYY format to month-YYYY format
    month_year = data['month_year']
    date_obj = datetime.strptime(month_year, '%m-%Y')  # Parse the date
    formatted_month_year = date_obj.strftime('%B-%Y')  # Convert to month-YYYY format

    doc_name = frappe.db.get_value("Dynamic Link",{"link_doctype":"Customer","link_name":data['custom_customer_name'],"parenttype":"Contact"},"parent")

    mo_no = frappe.db.get_value("Contact",doc_name,"mobile_no")
    
    # Create the Sales Invoice document
    si = frappe.get_doc({
        "doctype": "Sales Invoice",
        "customer": data['custom_customer_name'],
        "custom_contact_no": mo_no,
        "posting_date": frappe.utils.nowdate(),
        "items": [{
            "item_code": "Milk",
            "item_name": "Milk",
            "custom_month": formatted_month_year,  # Use the formatted month-YYYY format
            "custom_morning_qty": data['total_morning_qty'],
            "custom_evening_qty": data['total_evening_qty'],
            "qty": data['total_morning_qty'] + data['total_evening_qty']
        }]
    })
    
    # Save the Sales Invoice
    si.insert()

# Fetch go details in transfer donate go and death register go doctypes

@frappe.whitelist()
def fetch_go_master_field_list(doc_id):
    go_master_field = frappe.get_all(
        "Go Master",
        filters={"name": doc_id},
        fields=[
            "name",
            "tag_number",
            "go_name",
            "goshala_name",
            "seva",
            "reason",
            "remarks",
            "gender",
            "current_type",
            "nandi_type",
            "type",
            "staff",
            "doctor",
            "weight",
            "birth_date_time",
            "father_name",
            "mother_name",
            "colour",
            "full_name",
            "mobile_no",
            "address",
            "purchase_date",
            "donation_date",
            "city",
            "pincode",
            "price",
            "photo"
        ],
    )

    return [
        {
            "id":go_field.name,
            "tag_number": go_field.tag_number,
            "go_name": go_field.go_name,
            "goshala_name": go_field.goshala_name,
            "seva":go_field.seva,
            "reason":go_field.reason,
            "remarks":go_field.remarks,
            "gender": go_field.gender,
            "current_type": go_field.current_type,
            "nandi_type": go_field.nandi_type,
            "type": go_field.type,
            "staff": go_field.staff,
            "doctor": go_field.doctor,
            "weight": go_field.weight,
            "birth_date_time": go_field.birth_date_time,
            "father_name": go_field.father_name,
            "mother_name": go_field.mother_name,
            "colour": go_field.colour,
            "full_name": go_field.full_name,
            "mobile_no": go_field.mobile_no,
            "address": go_field.address,
            "purchase_date": go_field.purchase_date,
            "donation_date": go_field.donation_date,
            "city": go_field.city,
            "pincode": go_field.pincode,
            "price": go_field.price,
            "photo": go_field.photo,            
        }
        for go_field in go_master_field
    ]


@frappe.whitelist()
def disable_go_master_by_id(doc_id):
    if doc_id:
        try:
            # Fetch the Go Master document by ID
            go_master = frappe.get_doc("Go Master", doc_id)
            # Uncheck the 'enabled' field
            go_master.enabled = 0
            # Save the document
            go_master.save()
            frappe.db.commit()
            return {"status": "success", "message": f"Go Master with ID {doc_id} has been disabled."}
        except Exception as e:
            frappe.log_error(frappe.get_traceback(), f"Error disabling Go Master with ID {doc_id}")
            return {"status": "error", "message": str(e)}
    else:
        return {"status": "error", "message": "Invalid ID"}

