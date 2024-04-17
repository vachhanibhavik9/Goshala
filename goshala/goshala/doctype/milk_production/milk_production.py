# Copyright (c) 2024, goshala and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class MilkProduction(Document):
	def before_save(self):
		self.set_total_milk()
		

	def set_total_milk(self):
		self.total_milk = sum(i.total for i in self.milk_production_table)
		self.total_morning_milk = sum(i.morning for i in self.milk_production_table)
		self.total_evening_milk = sum(i.evening for i in self.milk_production_table)
		