/*
 * Copyright (c) 2025 Bloxtor (http://bloxtor.com) and Joao Pinto (http://jplpinto.com)
 * 
 * Multi-licensed: BSD 3-Clause | Apache 2.0 | GNU LGPL v3 | HLNC License (http://bloxtor.com/LICENSE_HLNC.md)
 * Choose one license that best fits your needs.
 *
 * Original JQuery Task flow Chart Repo: https://github.com/a19836/jquerytaskflowchart/
 * Original Bloxtor Repo: https://github.com/a19836/bloxtor
 *
 * YOU ARE NOT AUTHORIZED TO MODIFY OR REMOVE ANY PART OF THIS NOTICE!
 */

var myWFObj = {
	WF: taskFlowChartObj,
	setTaskFlowChart: function(WF) {
		this.WF = WF;
	},
	getTaskFlowChart: function() {
		return this.WF;
	}
};

function inputTextContainsRegex(text, valid_text_regex) {
	if (text && text.length > 0) {
		text = text.replace(/\n/g, "");
		var ret = typeof valid_text_regex == "string" ? (new RegExp(valid_text_regex)).test(text) : valid_text_regex.exec(text);
		return ret ? true : false;
	}
	return false;
}

function inputTextContainsAtLeastOneLetter(text) {
	return inputTextContainsRegex(text, /[a-z]+/i);
}

function isLabelValid(label_obj, ignore_msg) {
	var valid = !inputTextContainsRegex(label_obj.label, /[^\w\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1EBD\u1EBC\-\.\$ ]+/);
	if (valid) valid = inputTextContainsAtLeastOneLetter(label_obj.label);
	if (!valid && !ignore_msg) {
		var msg = "Invalid label. Please choose a different label.\nOnly this characters are allowed: a-z, A-Z, 0-9, '-', '_', '.', ' ', '$' and you must have at least 1 character.";
		if (label_obj.from_prompt) alert(msg);
		else myWFObj.getTaskFlowChart().StatusMessage.showError(msg);
	}
	return valid;
}

function isTaskLabelValid(label_obj, task_id, ignore_msg) {
	if (!isLabelValid(label_obj, ignore_msg)) return false;
	return isTaskLabelRepeated(label_obj, task_id, ignore_msg) == false;
}

function isTaskLabelRepeated(label_obj, task_id, ignore_msg) {
	var WF = myWFObj.getTaskFlowChart();
	var l = label_obj.label.toLowerCase();
	var tasks = WF.TaskFlow.getAllTasks();
	var total = tasks.length;
	for (var i = 0; i < total; i++) {
		var t = $(tasks[i]);
		var elm_label = WF.TaskFlow.getTaskLabel(t);
		if (l == elm_label.toLowerCase() && t.attr("id") != task_id) {
			if (!ignore_msg) {
				var msg = "Error: Repeated label.\nYou cannot have repeated labels!\nPlease try again...";
				WF.StatusMessage.showError(msg);
				var msg_elm = WF.StatusMessage.getMessageHtmlObj().children(".error").last();
				if (!msg_elm.is(":visible")) alert(msg);
			}
			return true;
		}
	}
	return false;
}

function isConnectionLabelValid(label_obj, task_id) {
	if (label_obj.label == "") return true;
	if (!isLabelValid(label_obj)) return false;
	return true;
}

function prepareLabelIfUserLabelIsInvalid(task_id) {
	var WF = myWFObj.getTaskFlowChart();
	var tasks = WF.TaskFlow.getAllTasks();
	var total = tasks.length;
	var task_label = WF.TaskFlow.getTaskLabelByTaskId(task_id);
	for (var i = 0; i < total; i++) {
		var t = $(tasks[i]);
		var elm_label = WF.TaskFlow.getTaskLabel(t);
		if (task_label == elm_label && t.attr("id") != task_id) {
			var r = parseInt(Math.random() * 10000);
			var new_label = task_label + "_" + r;
			WF.TaskFlow.getTaskLabelElementByTaskId(task_id).html(new_label);
			WF.TaskFlow.centerTaskInnerElements(task_id);
			break;
		}
	}
	return true;
}

function onTaskCloning(task_id, opts) {
	var WF = myWFObj.getTaskFlowChart();
	WF.TaskFlow.setTaskLabelByTaskId(task_id, {
		label: null
	});
	if (!opts || !opts["do_not_show_task_properties"]) WF.Property.showTaskProperties(task_id);
}

function checkIfValueIsTrue(value) {
	var v = typeof value == "string" ? value.toLowerCase() : "";
	return (value && value != null && value != 0 && value !== false && v != "null" && v != "false" && v != "0");
}

function onEditLabel(task_id) {
	var task = myWFObj.getTaskFlowChart().TaskFlow.getTaskById(task_id);
	var info = task.find(".info");
	var span = info.find("span").first();
	var width = span.width() + 50;
	task.css("width", width + "px");
	var num = 5;
	while (span.height() > info.height()) {
		width = info.width() + 50;
		task.css("width", width + "px");
		--num;
		if (num < 0) {
			break;
		}
	}
}

function updateTaskLabelInShownTaskProperties(task_id, task_properties_input_selector) {
	var WF = myWFObj.getTaskFlowChart();
	var task = WF.TaskFlow.getTaskById(task_id);
	var task_type = task.attr("type");
	var show_task_properties = WF.Property.isTaskSubSettingTrue(task_type, "task_menu", "show_properties_menu", true);
	if (show_task_properties) {
		var selected_task_properties = $("#" + WF.Property.selected_task_properties_id);
		if (selected_task_properties.is(":visible") && selected_task_properties.attr("task_id") == task_id) selected_task_properties.find(task_properties_input_selector).val(WF.TaskFlow.getTaskLabel(task));
	}
}

function stringToUCWords(str) {
	var parts = str.split(" ");
	for (var i = 0; i < parts.length; i++)
		if (parts[i]) parts[i] = parts[i].substr(0, 1).toUpperCase() + parts[i].substr(1);
	return parts.join(" ");
}

function checkIfValueIsAssociativeArray(value) {
	var is_associative = false;
	if ($.isPlainObject(value) && !$.isArray(value)) {
		var idx = 0;
		$.each(value, function(i, v) {
			if (idx != i) {
				is_associative = true;
				return false;
			}
			idx++;
		});
	}
	return is_associative;
}

function checkIfValueIsAssociativeNumericArray(value) {
	if (checkIfValueIsAssociativeArray(value)) {
		var is_numeric_keys = true;
		$.each(value, function(i, v) {
			if (!$.isNumeric(i)) {
				is_numeric_keys = false;
				return false;
			}
		});
		return is_numeric_keys;
	}
}

function showTaskPropertiesIfExists(task_id, task) {
	var WF = myWFObj.getTaskFlowChart();
	var task_type = task.attr("type");
	var show_task_properties = WF.Property.isTaskSubSettingTrue(task_type, "task_menu", "show_properties_menu", true);
	if (show_task_properties) {
		WF.Property.showTaskProperties(task_id, {
			do_not_call_hide_properties: true
		});
		if (WF.Property.isSelectedTaskPropertiesOpen()) WF.ContextMenu.hideContextMenus();
	}
}

function showConnectionPropertiesIfExists(connection) {
	if (connection) {
		var WF = myWFObj.getTaskFlowChart();
		var task_type = $("#" + connection.sourceId).attr("type");
		var show_connection_properties = WF.Property.isTaskSubSettingTrue(task_type, "connection_menu", "show_properties_menu", true);
		if (show_connection_properties) {
			WF.Property.showConnectionProperties(connection.id, {
				do_not_call_hide_properties: true
			});
			if (WF.Property.isSelectedConnectionPropertiesOpen()) WF.ContextMenu.hideContextMenus();
		}
	}
}

function getObjectorArraySize(obj_arr) {
	if ($.isArray(obj_arr)) return obj_arr.length;
	if ($.isPlainObject(obj_arr)) {
		var count = 0;
		for (var k in obj_arr) count++;
		return count;
	}
	return $.isNumeric(obj_arr.length) ? obj_arr.length : null;
}

function removeTableConnectionFromConnectionProperties(btn) {
	var WF = myWFObj.getTaskFlowChart();
	var selected_connection_properties = $(btn).closest("#" + WF.Property.selected_connection_properties_id);
	var connection_id = selected_connection_properties.attr("connection_id");
	WF.Property.hideSelectedConnectionProperties();
	if (connection_id) WF.TaskFlow.deleteConnection(connection_id);
}

function onTableConnectionDrop(conn) {
	if (conn.sourceId == conn.targetId) {
		var connector_type = conn.connection.connector.type;
		if (connector_type == "Flowchart") {
			var connection = conn.connection;
			connection.setParameter("connection_exit_type", "StateMachine");
			myWFObj.getTaskFlowChart().TaskFlow.setNewConnectionConnector(connection);
		}
	}
	return true;
}

function prepareTasksTableConnections() {
	var connections = myWFObj.getTaskFlowChart().TaskFlow.getConnections();
	for (var i = 0; i < connections.length; i++) getConfiguredTaskTableConnection(connections[i]);
}

function getConfiguredTaskTableConnection(conn) {
	var WF = myWFObj.getTaskFlowChart();
	var conn_overlay = conn.getParameter("connection_exit_overlay");
	if (conn_overlay == "One To Many") {
		var new_conn = WF.TaskFlow.flipConnection(conn.id);
		if (new_conn) {
			WF.TaskFlow.changeConnectionOverlayType(new_conn, "Many To One");
			var conn_connector = conn.getParameter("connection_exit_type");
			WF.TaskFlow.changeConnectionConnectorType(new_conn, conn_connector);
			var aux = WF.TaskFlow.connections_properties[new_conn.id]["source_columns"];
			WF.TaskFlow.connections_properties[new_conn.id]["source_columns"] = WF.TaskFlow.connections_properties[new_conn.id]["target_columns"];
			WF.TaskFlow.connections_properties[new_conn.id]["target_columns"] = aux;
			return new_conn;
		}
	}
	return conn;
}

function isTaskTableLabelValid(label_obj, task_id, ignore_msg) {
	var valid = false;
	var is_repeated = false;
	if (label_obj.label && label_obj.label.length > 0) {
		var valid = inputTextContainsRegex(label_obj.label, /^[\w\.\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1EBD\u1EBC]+$/gi);
		if (valid) valid = inputTextContainsAtLeastOneLetter(label_obj.label);
		if (valid) valid = inputTextContainsRegex(label_obj.label, /^[^\.]/);
		if (valid) {
			is_repeated = isTaskLabelRepeated(label_obj, task_id, ignore_msg);
			valid = is_repeated == false;
		}
		if (valid) isTaskTableNameAdvisable(label_obj.label);
	}
	if (!valid) {
		var msg = (is_repeated ? "\n" : "") + "Invalid label. Please choose a different label.\nOnly this characters are allowed: a-z, A-Z, 0-9, '_', '.' and you must have at least 1 letter.\nNote that by adding the '.' char you are adding a schema to your table.";
		myWFObj.getTaskFlowChart().StatusMessage.showError(msg);
	}
	return valid;
}

function isTaskTableNameAdvisable(name) {
	if (name) {
		var normalized = ("" + name);
		if (typeof normalized.normalize == "function") normalized = normalized.normalize("NFD");
		normalized = normalized.replace(/[\u0300-\u036f]/g, "");
		if (name != normalized) myWFObj.getTaskFlowChart().StatusMessage.showError("Is NOT advisable to add names with accents and with non-standard characters. Please try to only use A-Z 0-9 and '_'.");
	}
}

function normalizeTaskTableName(name) {
	return name ? ("" + name).replace(/(^\s+|\s+$)/g, "").replace(/\n/g, "").replace(/[ \-]+/g, "_").match(/[\w\.\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1EBD\u1EBC]+/gi).join("") : name;
}

function resizeTableTaskBasedOnAttributes(task_id) {
	var WF = myWFObj.getTaskFlowChart();
	var task = WF.TaskFlow.getTaskById(task_id);
	var items = task.find(" > ." + WF.TaskFlow.task_eps_class_name + " ." + WF.TaskFlow.task_ep_class_name + " .table_attr .name p");
	var name_elm = null;
	var n = "";
	$.each(items, function(idx, item) {
		item = $(item);
		name_elm = item.parent();
		var str = item.text();
		n = n.length < ("" + str).length ? str : n;
	});
	if (name_elm) {
		var span = document.createElement("SPAN");
		span = $(span);
		span.html(n);
		span.css("font-size", name_elm.css("font-size"));
		$('body').append(span);
		var diff = span.width() - name_elm.width();
		span.remove();
		if (diff > 0) {
			task.css("width", (parseInt(task.css("width")) + diff + 5) + "px");
			WF.TaskFlow.repaintTask(task);
		}
	}
}

var DBTableTaskPropertyObj = {
	table_charsets: null,
	table_storage_engines: null,
	table_collations: null,
	column_charsets: null,
	column_collations: null,
	column_types: null,
	column_simple_types: null,
	column_numeric_types: null,
	column_mandatory_length_types: null,
	column_types_ignored_props: null,
	column_types_hidden_props: null,
	show_properties_on_connection_drop: false,
	allow_column_sorting: false,
	allow_modify_table_encoding: false,
	allow_modify_table_storage_engine: false,
	on_load_task_properties_callback: null,
	on_submit_task_properties_callback: null,
	on_task_creation_callback: null,
	on_task_deletion_callback: null,
	on_update_simple_attributes_html_with_table_attributes_callback: null,
	on_update_table_attributes_html_with_simple_attributes_callback: null,
	on_add_table_attribute_callback: null,
	on_add_simple_attribute_callback: null,
	on_add_task_properties_attribute_callback: null,
	on_before_remove_task_properties_attribute_callback: null,
	on_before_sort_task_properties_attributes: null,
	selected_connection_properties_data: null,
	column_simple_custom_types: null,
	task_property_values_table_attr_prop_names: ["primary_key", "name", "type", "length", "null", "unsigned", "unique", "auto_increment", "has_default", "default", "extra", "charset", "collation", "comment"],
	current_short_attr_input_active: null,
	
	onLoadTaskProperties: function(properties_html_elm, task_id, task_property_values) {
		var task_html_elm = properties_html_elm.find('.db_table_task_html');
		var WF = myWFObj.getTaskFlowChart();
		task_html_elm.tabs();
		task_html_elm.find(" > ul > li > a").click(function(ev) {
			var tab_panel_id = $(this).attr("href").replace("#", "");
			task_html_elm.removeClass("simple_ui_shown advanced_ui_shown").addClass(tab_panel_id + "_shown");
		});
		var charsets = $.isPlainObject(DBTableTaskPropertyObj.table_charsets) ? DBTableTaskPropertyObj.table_charsets : {};
		var collations = $.isPlainObject(DBTableTaskPropertyObj.table_collations) ? DBTableTaskPropertyObj.table_collations : {};
		var storage_engines = $.isPlainObject(DBTableTaskPropertyObj.table_storage_engines) ? DBTableTaskPropertyObj.table_storage_engines : {};
		var task_label = WF.TaskFlow.getTaskLabelByTaskId(task_id);
		task_html_elm.find('.table_name input').val(task_label);
		var charset_options = '<option value="">-- Default --</option>';
		var charset_exists = false;
		var charset_lower = task_property_values.table_charset ? ("" + task_property_values.table_charset).toLowerCase() : "";
		var table_charset_elm = task_html_elm.find('.table_charset');
		if ($.isEmptyObject(charsets)) table_charset_elm.hide();
		else {
			table_charset_elm.show();
			for (var charset_id in charsets) {
				var selected = ("" + charset_id).toLowerCase() == charset_lower;
				charset_options += '<option value="' + charset_id + '"' + (selected ? ' selected' : '') + '>' + charsets[charset_id] + '</option>';
				if (selected) charset_exists = true;
			}
		}
		if (task_property_values.table_charset && !charset_exists) charset_options += '<option value="' + task_property_values.table_charset + '" selected>' + task_property_values.table_charset + ' - NON DEFAULT</option>';
		table_charset_elm.find('select').html(charset_options);
		if (DBTableTaskPropertyObj.allow_modify_table_encoding) table_charset_elm.show();
		else table_charset_elm.hide();
		var collation_options = '<option value="">-- Default --</option>';
		var collation_exists = false;
		var collation_lower = task_property_values.table_collation ? ("" + task_property_values.table_collation).toLowerCase() : "";
		var table_collation_elm = task_html_elm.find('.table_collation');
		if ($.isEmptyObject(collations)) table_collation_elm.hide();
		else {
			table_collation_elm.show();
			for (var collation_id in collations) {
				var selected = ("" + collation_id).toLowerCase() == collation_lower;
				collation_options += '<option value="' + collation_id + '"' + (selected ? ' selected' : '') + '>' + collations[collation_id] + '</option>';
				if (selected) collation_exists = true;
			}
		}
		if (task_property_values.table_collation && !collation_exists) collation_options += '<option value="' + task_property_values.table_collation + '" selected>' + task_property_values.table_collation + ' - NON DEFAULT</option>';
		table_collation_elm.find('select').html(collation_options);
		if (DBTableTaskPropertyObj.allow_modify_table_encoding) table_collation_elm.show();
		else table_collation_elm.hide();
		var storage_engine_options = '<option value="">-- Default --</option>';
		var storage_engine_exists = false;
		var storage_engine_lower = task_property_values.table_storage_engine ? ("" + task_property_values.table_storage_engine).toLowerCase() : "";
		var table_storage_engine_elm = task_html_elm.find('.table_storage_engine');
		if ($.isEmptyObject(storage_engines)) table_storage_engine_elm.hide();
		else {
			table_storage_engine_elm.show();
			for (var storage_engine_id in storage_engines) {
				var selected = ("" + storage_engine_id).toLowerCase() == storage_engine_lower;
				storage_engine_options += '<option value="' + storage_engine_id + '"' + (selected ? ' selected' : '') + '>' + storage_engines[storage_engine_id] + '</option>';
				if (selected) storage_engine_exists = true;
			}
		}
		if (task_property_values.table_storage_engine && !storage_engine_exists) storage_engine_options += '<option value="' + task_property_values.table_storage_engine + '" selected>' + task_property_values.table_storage_engine + ' - NON DEFAULT</option>';
		table_storage_engine_elm.find('select').html(storage_engine_options);
		if (DBTableTaskPropertyObj.allow_modify_table_storage_engine) table_storage_engine_elm.show();
		else table_storage_engine_elm.hide();
		task_html_elm.find('.table_attrs').html("");
		DBTableTaskPropertyObj.column_simple_custom_types = {};
		if ($.isArray(DBTableTaskPropertyObj.column_types_hidden_props))
			for (var i = 0; i < DBTableTaskPropertyObj.column_types_hidden_props.length; i++) {
				var prop_name = DBTableTaskPropertyObj.column_types_hidden_props[i];
				if (prop_name) task_html_elm.find('table thead .table_attr_' + prop_name).hide();
			}
		var simple_attributes_html = "";
		var advanced_attributes_html = "";
		if (!task_property_values || !task_property_values.table_attr_names || getObjectorArraySize(task_property_values.table_attr_names) == 0) {
			task_property_values = DBTableTaskPropertyObj.prepareTaskPropertyValuesWithDefaultAttributes(task_property_values);
		}
		if (task_property_values && task_property_values.table_attr_names && getObjectorArraySize(task_property_values.table_attr_names) > 0) {
			DBTableTaskPropertyObj.regularizeTaskPropertyValues(task_property_values);
			$.each(task_property_values.table_attr_names, function(i, table_attr_name) {
				var data = {};
				for (var j = 0; j < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; j++) {
					var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[j];
					data[prop_name] = task_property_values["table_attr_" + prop_name + "s"][i];
				}
				advanced_attributes_html += DBTableTaskPropertyObj.getTableAttributeHtml(data);
				simple_attributes_html += DBTableTaskPropertyObj.getSimpleAttributeHtml(data);
			});
		}
		task_html_elm.find(".table_attrs").html(advanced_attributes_html);
		task_html_elm.find(".simple_attributes > ul").append(simple_attributes_html);
		if (simple_attributes_html) task_html_elm.find(".simple_attributes > ul > .no_simple_attributes").hide();
		var is_fixed_properties_panel = $("#" + WF.TaskFlow.main_tasks_flow_obj_id).parent().closest(".taskflowchart").hasClass("fixed_side_properties");
		if (is_fixed_properties_panel) DBTableTaskPropertyObj.convertTableToList(task_html_elm.find(".attributes .switch")[0]);
		if (typeof DBTableTaskPropertyObj.on_load_task_properties_callback == "function") DBTableTaskPropertyObj.on_load_task_properties_callback(properties_html_elm, task_id, task_property_values);
	},
	onSubmitTaskProperties: function(properties_html_elm, task_id, task_property_values) {
		var fields = DBTableTaskPropertyObj.getParsedTaskPropertyFields(properties_html_elm, task_id);
		var status = false;
		if (fields) {
			DBTableTaskPropertyObj.prepareShortTableAttributes(task_id, fields);
			status = true;
			if (typeof DBTableTaskPropertyObj.on_submit_task_properties_callback == "function") status = DBTableTaskPropertyObj.on_submit_task_properties_callback(properties_html_elm, task_id, task_property_values);
		}
		return status;
	},
	getParsedTaskPropertyFields: function(properties_html_elm, task_id) {
		var task_html_elm = properties_html_elm.find('.db_table_task_html');
		var task_label = task_html_elm.find(".table_name input").val();
		var label_obj = {
			label: task_label
		};
		var is_attributes_list_shown = task_html_elm.hasClass("attributes_list_shown");
		var switch_icon = task_html_elm.find(".attributes .switch");
		var active_tab = task_html_elm.tabs('option', 'active');
		var auto_save = myWFObj.getTaskFlowChart().Property.auto_save;
		if (active_tab == 0) {
			if (confirm("in order to save, the system will now convert the Simple UI's attributes into the Advanced UI. Do you wish to proceed?")) DBTableTaskPropertyObj.updateTableAttributesHtmlWithSimpleAttributes(task_html_elm.find(" > ul > li > a")[0], true);
			else return false;
		}
		if (is_attributes_list_shown) DBTableTaskPropertyObj.convertListToTable(switch_icon[0]);
		var has_defaults = task_html_elm.find(".table_attr_has_default .task_property_field");
		var defaults = task_html_elm.find(".table_attr_default .task_property_field");
		for (var i = 0; i < has_defaults.length; i++) {
			if (defaults[i].value) {
				has_defaults[i].setAttribute("checked", "checked");
				$(defaults[i]).val(defaults[i].value.replace(/\"/g, '\''));
			}
		}
		var names = task_html_elm.find(".table_attr_name .task_property_field");
		for (var i = 0; i < names.length; i++) {
			var v = $(names[i]).val();
			$(names[i]).val(normalizeTaskTableName(v));
		}
		var fields = null;
		if (DBTableTaskPropertyObj.onCheckLabel(label_obj, task_id)) {
			var primary_keys_fields = task_html_elm.find(".table_attr_primary_key .task_property_field");
			var names_fields = task_html_elm.find(".table_attr_name .task_property_field");
			var types_fields = task_html_elm.find(".table_attr_type .task_property_field");
			var lengths_fields = task_html_elm.find(".table_attr_length .task_property_field");
			var nulls_fields = task_html_elm.find(".table_attr_null .task_property_field");
			var unsigneds_fields = task_html_elm.find(".table_attr_unsigned .task_property_field");
			var uks_fields = task_html_elm.find(".table_attr_unique .task_property_field");
			var auto_increments_fields = task_html_elm.find(".table_attr_auto_increment .task_property_field");
			var has_defaults_fields = task_html_elm.find(".table_attr_has_default .task_property_field");
			var defaults_fields = task_html_elm.find(".table_attr_default .task_property_field");
			var extras_fields = task_html_elm.find(".table_attr_extra .task_property_field");
			var charsets_fields = task_html_elm.find(".table_attr_charset .task_property_field");
			var collations_fields = task_html_elm.find(".table_attr_collation .task_property_field");
			var comments_fields = task_html_elm.find(".table_attr_comment .task_property_field");
			var column_types_ignored_props = $.isPlainObject(DBTableTaskPropertyObj.column_types_ignored_props) ? DBTableTaskPropertyObj.column_types_ignored_props : {};
			$.each(lengths_fields, function(index, length_field) {
				var type = $(types_fields[index]).val();
				var column_type_ignored_props = type && column_types_ignored_props.hasOwnProperty(type) && $.isArray(column_types_ignored_props[type]) ? column_types_ignored_props[type] : [];
				var is_length_disabled = !type || $.inArray("length", column_type_ignored_props) != -1;
				var length = $(length_field).val();
				lengths_fields[index] = !is_length_disabled && (length || parseInt(length) === 0) ? length_field : null;
			});
			$.each(types_fields, function(index, type_field) {
				type_field = $(type_field);
				var type = type_field.val();
				var tr = type_field.parent().closest("tr");
				DBTableTaskPropertyObj.prepareAttributeSerialType(tr, type);
			});
			fields = {
				table_name: label_obj.label,
				table_attr_names: names_fields,
				table_attr_primary_keys: primary_keys_fields,
				table_attr_types: types_fields,
				table_attr_lengths: lengths_fields,
				table_attr_nulls: nulls_fields,
				table_attr_unsigneds: unsigneds_fields,
				table_attr_uniques: uks_fields,
				table_attr_auto_increments: auto_increments_fields,
				table_attr_has_defaults: has_defaults_fields,
				table_attr_defaults: defaults_fields,
				table_attr_extras: extras_fields,
				table_attr_charsets: charsets_fields,
				table_attr_collations: collations_fields,
				table_attr_comments: comments_fields,
			};
		}
		if (is_attributes_list_shown) DBTableTaskPropertyObj.convertTableToList(switch_icon[0]);
		return fields;
	},
	onCheckLabel: function(label_obj, task_id) {
		if (isTaskTableLabelValid(label_obj, task_id)) return true;
		myWFObj.getTaskFlowChart().StatusMessage.removeLastShownMessage("error");
		label_obj.label = normalizeTaskTableName(label_obj.label);
		if (isTaskTableLabelValid(label_obj, task_id)) return true;
		return false;
	},
	onCancelLabel: function(task_id) {
		return prepareLabelIfUserLabelIsInvalid(task_id);
	},
	onCompleteLabel: function(task_id) {
		onEditLabel(task_id);
		updateTaskLabelInShownTaskProperties(task_id, ".db_table_task_html .table_name input");
		myWFObj.getTaskFlowChart().TaskFlow.repaintTaskByTaskId(task_id);
		return true;
	},
	onTaskCreation: function(task_id) {
		var task_property_values = myWFObj.getTaskFlowChart().TaskFlow.tasks_properties[task_id];
		if (task_property_values && task_property_values.table_attr_names && getObjectorArraySize(task_property_values.table_attr_names) > 0) {
			DBTableTaskPropertyObj.regularizeTaskPropertyValues(task_property_values);
			DBTableTaskPropertyObj.prepareShortTableAttributes(task_id, task_property_values);
		}
		DBTableTaskPropertyObj.addShortActionsButton(task_id);
		if (typeof DBTableTaskPropertyObj.on_task_creation_callback == "function") DBTableTaskPropertyObj.on_task_creation_callback(task_id);
	},
	onTaskDeletion: function(task_id, task) {
		if (typeof DBTableTaskPropertyObj.on_task_deletion_callback == "function") DBTableTaskPropertyObj.on_task_deletion_callback(task_id, task);
	},
	sortTaskPropertiesAttributes: function(task_id, attributes_names) {
		if (attributes_names) {
			var WF = myWFObj.getTaskFlowChart();
			var task_property_values = WF.TaskFlow.tasks_properties[task_id];
			if (task_property_values && task_property_values.table_attr_names) {
				var changed = false;
				if (typeof DBTableTaskPropertyObj.on_before_sort_task_properties_attributes == "function") changed = DBTableTaskPropertyObj.on_before_sort_task_properties_attributes(task_id, attributes_names);
				var table_attr_names = assignObjectRecursively({}, task_property_values.table_attr_names);
				$.each(table_attr_names, function(i, table_attr_name) {
					if ($.isPlainObject(task_property_values.table_attr_names)) task_property_values.table_attr_names = $.map(task_property_values.table_attr_names, function(value, idx) {
						return [value];
					});
					var from_index = task_property_values.table_attr_names.indexOf(table_attr_name);
					var to_index = attributes_names.indexOf(table_attr_name);
					if (to_index != -1 && to_index != from_index) {
						changed = true;
						for (var j = 0; j < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; j++) {
							var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[j];
							var key = "table_attr_" + prop_name + "s";
							var arr = task_property_values[key];
							if ($.isPlainObject(arr)) arr = $.map(arr, function(value, idx) {
								return [value];
							});
							var value = arr.splice(from_index, 1)[0];
							arr.splice(to_index, 0, value);
							task_property_values[key] = arr;
						}
					}
				});
				if (changed) WF.TaskFlow.tasks_properties[task_id] = task_property_values;
			}
		}
	},
	updateTaskPropertiesAttribute: function(task_id, attribute_name, attribute_data, attribute_index) {
		if (attribute_name && (!$.isPlainObject(attribute_data) || !attribute_data["name"])) this.removeTaskPropertiesAttribute(task_id, attribute_name);
		else if ($.isPlainObject(attribute_data) && attribute_data["name"]) {
			var WF = myWFObj.getTaskFlowChart();
			var task_property_values = WF.TaskFlow.tasks_properties[task_id];
			var exists = false;
			if (attribute_name && task_property_values && task_property_values.table_attr_names) $.each(task_property_values.table_attr_names, function(i, table_attr_name) {
				if (table_attr_name == attribute_name && (!$.isNumeric(attribute_index) || attribute_index < 0 || attribute_index == i)) {
					exists = true;
					for (var j = 0; j < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; j++) {
						var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[j];
						if (attribute_data.hasOwnProperty(prop_name)) task_property_values["table_attr_" + prop_name + "s"][i] = attribute_data[prop_name];
					}
					return false;
				}
			});
			if (!exists) {
				exists = true;
				var new_index = 0;
				if (!$.isPlainObject(task_property_values)) task_property_values = {};
				if ($.isArray(task_property_values.table_attr_names)) new_index = task_property_values.table_attr_names.length;
				else if ($.isPlainObject(task_property_values.table_attr_names))
					for (var i in task_property_values.table_attr_names)
						if ($.isNumeric(i) && parseInt(i) > new_index) new_index = parseInt(i);
				for (var j = 0; j < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; j++) {
					var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[j];
					var prop_value = attribute_data.hasOwnProperty(prop_name) ? attribute_data[prop_name] : "";
					var key = "table_attr_" + prop_name + "s";
					if ($.isArray(task_property_values[key])) task_property_values[key].push(prop_value);
					else {
						if (!$.isPlainObject(task_property_values[key])) task_property_values[key] = {};
						task_property_values[key][new_index] = prop_value;
					}
				}
				if (typeof DBTableTaskPropertyObj.on_add_task_properties_attribute_callback == "function") status = DBTableTaskPropertyObj.on_add_task_properties_attribute_callback(task_id, attribute_name, attribute_data, new_index);
				if ($.isNumeric(attribute_index) && attribute_index >= 0 && attribute_index != new_index) {
					var attributes_names = $.map(assignObjectRecursively({}, task_property_values.table_attr_names), function(value, idx) {
						return [value];
					});
					var name = attributes_names.splice(new_index, 1)[0];
					attributes_names.splice(attribute_index, 0, name);
					DBTableTaskPropertyObj.sortTaskPropertiesAttributes(task_id, attributes_names);
				}
			}
			WF.TaskFlow.tasks_properties[task_id] = task_property_values;
		}
	},
	removeTaskPropertiesAttribute: function(task_id, attribute_name) {
		if (attribute_name) {
			var WF = myWFObj.getTaskFlowChart();
			var task_property_values = WF.TaskFlow.tasks_properties[task_id];
			if (task_property_values && task_property_values.table_attr_names) {
				var status = true;
				if (typeof DBTableTaskPropertyObj.on_before_remove_task_properties_attribute_callback == "function") status = DBTableTaskPropertyObj.on_before_remove_task_properties_attribute_callback(task_id, attribute_name);
				if (status) {
					var exists = false;
					$.each(task_property_values.table_attr_names, function(i, table_attr_name) {
						if (table_attr_name == attribute_name) {
							exists = true;
							for (var j = 0; j < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; j++) {
								var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[j];
								var key = "table_attr_" + prop_name + "s";
								if ($.isArray(task_property_values[key])) task_property_values[key].splice(i, 1);
								else if ($.isPlainObject(task_property_values[key])) delete task_property_values[key][i];
							}
							return false;
						}
					});
					if (exists) WF.TaskFlow.tasks_properties[task_id] = task_property_values;
				}
			}
		}
	},
	addShortActionsButton: function(task_id) {
		var WF = myWFObj.getTaskFlowChart();
		var task = WF.TaskFlow.getTaskById(task_id);
		var short_actions = task.find(".short_actions");
		var html = '<span class="add_attribute_action" onClick="DBTableTaskPropertyObj.addShortTableAttribute(this, event)"></span>';
		var add_attribute_icon = $(html);
		short_actions.prepend(add_attribute_icon);
		return add_attribute_icon;
	},
	addShortTableAttribute: function(elm, event) {
		event.stopPropagation();
		elm = $(elm);
		var task = elm.parent().closest(".task");
		var task_id = task.attr("id");
		var WF = myWFObj.getTaskFlowChart();
		var eps = task.children("." + WF.TaskFlow.task_eps_class_name);
		var table_attrs = eps.find(" > table.table_attrs > tbody");
		var html = this.getShortTableAttributeRowHtml();
		var attribute = $(html);
		this.prepareShortTableAttributeRowEvents(attribute);
		table_attrs.append(attribute);
		WF.TaskFlow.repaintTask(task);
		attribute.find(".name input").focus();
		var select = attribute.find(".type select");
		select.val("simple_name");
		if (select.val() != "simple_name") select.val("varchar");
		attribute.find(".type input").val(50);
		return attribute;
	},
	removeShortTableAttribute: function(elm, event) {
		event.stopPropagation();
		elm = $(elm);
		var table_attr = elm.parent().closest(".table_attr");
		var attribute_name = table_attr.attr("data_attribute_name");
		var task = table_attr.parent().closest(".task");
		var task_id = task.attr("id");
		if (task_id && attribute_name) this.removeTaskPropertiesAttribute(task_id, attribute_name);
		table_attr.remove();
		myWFObj.getTaskFlowChart().TaskFlow.repaintTask(task);
	},
	prepareShortTableAttributes: function(task_id, data) {
		if (data) {
			var label = data.table_name;
			var WF = myWFObj.getTaskFlowChart();
			var task = WF.TaskFlow.getTaskById(task_id);
			WF.TaskFlow.getTaskLabelElement(task).html(label);
			onEditLabel(task_id);
			var primary_keys = data.table_attr_primary_keys;
			var names = data.table_attr_names;
			var types = data.table_attr_types;
			var lengths = data.table_attr_lengths;
			var nulls = data.table_attr_nulls;
			var unsigneds = data.table_attr_unsigneds;
			var uniques = data.table_attr_uniques;
			var auto_increments = data.table_attr_auto_increments;
			var has_defaults = data.table_attr_has_defaults;
			var defaults = data.table_attr_defaults;
			var extras = data.table_attr_extras;
			var charsets = data.table_attr_charsets;
			var collations = data.table_attr_collations;
			var comments = data.table_attr_comments;
			if (names) {
				var fks = DBTableTaskPropertyObj.getTaskForeignKeys(task_id);
				var html = '<table class="table_attrs"><tbody>';
				for (var i = 0; i < names.length; i++) {
					var name = names[i] && names[i].nodeName && names[i].nodeName.toLowerCase() == "input" ? $(names[i]).val() : names[i];
					var primary_key = primary_keys[i] && primary_keys[i].nodeName && primary_keys[i].nodeName.toLowerCase() == "input" ? $(primary_keys[i]).is(":checked") : checkIfValueIsTrue(primary_keys[i]);
					var type = types[i] && types[i].nodeName && types[i].nodeName.toLowerCase() == "select" ? $(types[i]).val() : types[i];
					var length = lengths[i] && lengths[i].nodeName && lengths[i].nodeName.toLowerCase() == "input" ? $(lengths[i]).val() : lengths[i];
					var is_null = nulls[i] && nulls[i].nodeName && nulls[i].nodeName.toLowerCase() == "input" ? $(nulls[i]).is(":checked") : checkIfValueIsTrue(nulls[i]);
					var unsigned = unsigneds[i] && unsigneds[i].nodeName && unsigneds[i].nodeName.toLowerCase() == "input" ? $(unsigneds[i]).is(":checked") : checkIfValueIsTrue(unsigneds[i]);
					var unique = uniques[i] && uniques[i].nodeName && uniques[i].nodeName.toLowerCase() == "input" ? $(uniques[i]).is(":checked") : checkIfValueIsTrue(uniques[i]);
					var auto_increment = auto_increments[i] && auto_increments[i].nodeName && auto_increments[i].nodeName.toLowerCase() == "input" ? $(auto_increments[i]).is(":checked") : checkIfValueIsTrue(auto_increments[i]);
					var has_default = has_defaults[i] && has_defaults[i].nodeName && has_defaults[i].nodeName.toLowerCase() == "input" ? $(has_defaults[i]).is(":checked") : checkIfValueIsTrue(has_defaults[i]);
					var default_value = defaults[i] && defaults[i].nodeName && defaults[i].nodeName.toLowerCase() == "input" ? (!$(defaults[i]).is(":disabled") ? $(defaults[i]).val() : null) : defaults[i];
					var extra = extras[i] && extras[i].nodeName && extras[i].nodeName.toLowerCase() == "input" ? $(extras[i]).val() : extras[i];
					var charset = charsets[i] && charsets[i].nodeName && charsets[i].nodeName.toLowerCase() == "select" ? $(charsets[i]).val() : charsets[i];
					var collation = collations[i] && collations[i].nodeName && collations[i].nodeName.toLowerCase() == "select" ? $(collations[i]).val() : collations[i];
					var comment = comments[i] && comments[i].nodeName && comments[i].nodeName.toLowerCase() == "input" ? $(comments[i]).val() : comments[i];
					var attribute_data = {
						name: name,
						primary_key: primary_key,
						type: type,
						original_type: type,
						length: length,
						"null": is_null,
						unsigned: unsigned,
						unique: unique,
						auto_increment: auto_increment,
						"default": default_value,
						extra: extra,
						charset: charset,
						collation: collation,
						comment: comment
					};
					attribute_data = DBTableTaskPropertyObj.prepareTaskTableAttributeData(attribute_data, fks);
					html += DBTableTaskPropertyObj.getShortTableAttributeRowHtml(attribute_data);
				}
				html += "</tbody></table>";
				var eps = task.children("." + WF.TaskFlow.task_eps_class_name);
				eps.children(".table_attrs").remove();
				eps.append(html);
				eps.find(".table_attrs .table_attr").each(function(idx, table_attr) {
					DBTableTaskPropertyObj.prepareShortTableAttributeRowEvents($(table_attr));
				});
				if (DBTableTaskPropertyObj.allow_column_sorting) {
					task.addClass("allow_sort");
					var tbody = eps.find(".table_attrs tbody");
					tbody.sortable({
						scroll: true,
						scrollSensitivity: 20,
						connectWith: "tbody",
						items: "tr.table_attr",
						containment: tbody,
						appendTo: tbody,
						handle: " > .button > .icon.move",
						revert: true,
						cursor: "ns-resize",
						tolerance: "pointer",
						grid: [5, 5],
						axis: "y",
						helper: "clone",
						greedy: true,
						start: function(event, ui_obj) {},
						sort: function(event, ui_obj) {
							WF.ContextMenu.hideContextMenus();
						},
						stop: function(event, ui_obj) {
							var item = ui_obj.item;
							var trs = item.parent().children();
							var new_attributes_names = [];
							for (var i = 0; i < trs.length; i++) new_attributes_names.push(trs[i].getAttribute("data_attribute_name"));
							DBTableTaskPropertyObj.sortTaskPropertiesAttributes(task_id, new_attributes_names);
						},
					});
					tbody.click(function(event) {
						event.stopPropagation();
					});
				}
				var label_height = parseInt(task.children("." + WF.TaskFlow.task_label_class_name).height());
				var min_height = parseInt(task.css("min-height"));
				var height = names.length * 18 + label_height;
				height = height < min_height ? min_height : height;
				task.css("height", height);
				DBTableTaskPropertyObj.checkingTaskConnectionsPropertiesFromTaskProperties(task_id);
				resizeTableTaskBasedOnAttributes(task_id);
				WF.TaskFlow.repaintTask(task);
			}
		}
	},
	getShortTableAttributeRowHtml: function(data) {
		if (!$.isPlainObject(data)) data = {
			name: "",
			type: "",
			original_type: ""
		};
		var type = data["type"];
		var original_type = data["original_type"];
		var column_type_ignored_props = original_type && $.isPlainObject(this.column_types_ignored_props) && this.column_types_ignored_props.hasOwnProperty(original_type) && $.isArray(this.column_types_ignored_props[original_type]) ? this.column_types_ignored_props[original_type] : [];
		var is_length_disabled = !original_type || $.inArray("length", column_type_ignored_props) != -1;
		var title = this.getShortTableAttributeRowTitle(data);
		var key_type_options = this.getShortTableAttributeRowKeyTypeOptions(data["key_type"]);
		var type_options = this.getSimpleAttributeTypeOptions(type, original_type);
		var length_html = (!type || !is_length_disabled ? ('<input value="' + (data["length"] || parseInt(data["length"]) === 0 ? data["length"] : "") + '" />') : "");
		var html = '<tr class="table_attr" title="' + title + '" data_attribute_name="' + data["name"] + '">' + '<td class="key_type">' + '<select>' + key_type_options + '</select>' + '</td>' + '<td class="name">' + '<input value="' + data["name"] + '" />' + '</td>' + '<td class="type' + (length_html ? " with_length" : "") + '">' + '<select onChange="DBTableTaskPropertyObj.onChangeShortTableAttributeType(this)">' + type_options + '</select>' + length_html + '</td>' + '<td class="button">' + '<span class="icon remove" onClick="DBTableTaskPropertyObj.removeShortTableAttribute(this, event)"></span>' + (DBTableTaskPropertyObj.allow_column_sorting ? '<span class="icon move"></span>' : '') + '</td>' + '</tr>';
		return html;
	},
	prepareShortTableAttributeRowEvents: function(table_attr) {
		table_attr.click(function(event) {
			event.stopPropagation();
		});
		table_attr.find("input").on("blur", function(event) {
			var input = $(this);
			var timeout_id = table_attr.data("timeout_id");
			timeout_id && clearTimeout(timeout_id);
			if (input.parent().is(".name")) DBTableTaskPropertyObj.onChangeShortTableAttributeNameInput(input[0]);
			else DBTableTaskPropertyObj.onChangeShortTableAttribute(input[0]);
		}).on("keyup", function(event) {
			var input = $(this);
			var timeout_id = table_attr.data("timeout_id");
			timeout_id && clearTimeout(timeout_id);
			timeout_id = setTimeout(function() {
				table_attr.data("timeout_id", null);
				if (input.parent().is(".name")) DBTableTaskPropertyObj.onChangeShortTableAttributeNameInput(input[0]);
				else DBTableTaskPropertyObj.onChangeShortTableAttribute(input[0]);
			}, 2000);
			table_attr.data("timeout_id", timeout_id);
		}).on("mousedown", function(event) {
			DBTableTaskPropertyObj.current_short_attr_input_active = this;
		});
		table_attr.find("select").on("change", function(event) {
			DBTableTaskPropertyObj.onChangeShortTableAttributeTypeSelectBox(this);
		}).on("mousedown", function(event) {
			event.stopPropagation();
		});
	},
	onChangeShortTableAttributeType: function(elm) {
		elm = $(elm);
		var type = elm.val();
		var length_input = elm.parent().children("input");
		if (length_input.val() == "") {
			var column_simple_types = $.isPlainObject(DBTableTaskPropertyObj.column_simple_types) ? DBTableTaskPropertyObj.column_simple_types : {};
			var column_simple_custom_types = $.isPlainObject(DBTableTaskPropertyObj.column_simple_custom_types) ? DBTableTaskPropertyObj.column_simple_custom_types : {};
			var simple_props = type && column_simple_types.hasOwnProperty(type) ? column_simple_types[type] : (type && column_simple_custom_types.hasOwnProperty(type) ? column_simple_custom_types[type] : null);
			var column_mandatory_length_types = $.isPlainObject(DBTableTaskPropertyObj.column_mandatory_length_types) ? DBTableTaskPropertyObj.column_mandatory_length_types : {};
			var column_mandatory_length_type = type && column_mandatory_length_types.hasOwnProperty(type) ? column_mandatory_length_types[type] : null;
			if (simple_props && ($.isNumeric(simple_props["length"]) || simple_props["length"])) column_mandatory_length_type = simple_props["length"];
			if ($.isNumeric(column_mandatory_length_type) || column_mandatory_length_type) length_input.val(column_mandatory_length_type);
		}
	},
	onChangeShortTableAttributeTypeSelectBox: function(elm) {
		var elm = $(elm);
		var td = elm.parent();
		if (td.is(".type")) {
			var type = elm.val();
			var table_attr = $(elm).parent().closest(".table_attr");
			var key_type_select = table_attr.find(".key_type select");
			var length_input = table_attr.find(".type input");
			var column_simple_types = $.isPlainObject(DBTableTaskPropertyObj.column_simple_types) ? DBTableTaskPropertyObj.column_simple_types : {};
			var column_simple_custom_types = $.isPlainObject(DBTableTaskPropertyObj.column_simple_custom_types) ? DBTableTaskPropertyObj.column_simple_custom_types : {};
			var column_mandatory_length_types = $.isPlainObject(DBTableTaskPropertyObj.column_mandatory_length_types) ? DBTableTaskPropertyObj.column_mandatory_length_types : {};
			var column_mandatory_length_type = type && column_mandatory_length_types.hasOwnProperty(type) ? column_mandatory_length_types[type] : null;
			var simple_props = type && column_simple_types.hasOwnProperty(type) ? column_simple_types[type] : (type && column_simple_custom_types.hasOwnProperty(type) ? column_simple_custom_types[type] : null);
			if (simple_props) {
				var is_auto_increment = (simple_props.hasOwnProperty("auto_increment") && simple_props["auto_increment"]) || (simple_props.hasOwnProperty("extra") && typeof simple_props["extra"] == "string" && simple_props["extra"].toLowerCase().indexOf("auto_increment") != -1);
				if (is_auto_increment) {
					var task = table_attr.parent().closest(".task");
					var task_id = task.attr("id");
					var attributes_data = DBTableTaskPropertyObj.getTaskTableAttributesData(task_id);
					if (attributes_data) {
						var attribute_name = table_attr.find(".name input").val();
						var auto_increments_count = 0;
						for (var k in attributes_data)
							if (k != attribute_name && attributes_data[k]["auto_increment"]) auto_increments_count++;
						if (auto_increments_count > 0) {
							elm.val("");
							myWFObj.getTaskFlowChart().StatusMessage.showError("You cannot have more than one auto increment field! Please choose another type...");
						}
					}
				}
				if (simple_props["primary_key"]) key_type_select.val("pk");
				else if (simple_props["unique"]) key_type_select.val("uk");
				else key_type_select.val("");
				if ($.isNumeric(simple_props["length"]) || simple_props["length"]) column_mandatory_length_type = simple_props["length"];
				else {
					var native_types = simple_props["type"];
					if (!$.isArray(native_types)) native_types = [native_types];
					for (var i = 0; i < native_types.length; i++) {
						var native_type = native_types[i];
						if (native_type && column_mandatory_length_types.hasOwnProperty(native_type)) {
							column_mandatory_length_type = column_mandatory_length_types[native_type];
							break;
						}
					}
				}
			}
			if (length_input.val() == "" && ($.isNumeric(column_mandatory_length_type) || column_mandatory_length_type)) length_input.val(column_mandatory_length_type);
		}
		DBTableTaskPropertyObj.onChangeShortTableAttribute(elm[0]);
	},
	onChangeShortTableAttributeNameInput: function(elm) {
		var elm = $(elm);
		var td = elm.parent();
		if (td.is(".name")) {
			var table_attr = td.parent().closest(".table_attr");
			var attribute_name = table_attr.attr("data_attribute_name");
			var new_attribute_name = elm.val().replace(/\s/g, "");
			var is_attribute_name_different = attribute_name != new_attribute_name;
			if (is_attribute_name_different) {
				var type = this.getSimpleTypeBasedInAttributeName(new_attribute_name);
				if (type) {
					table_attr.find(".type input").val("");
					var select = table_attr.find(".type select");
					select.val(type);
					this.onChangeShortTableAttributeType(select[0]);
				}
			}
		}
		this.onChangeShortTableAttribute(elm[0]);
	},
	onChangeShortTableAttribute: function(elm) {
		var table_attr = $(elm).parent().closest(".table_attr");
		var attribute_name = table_attr.attr("data_attribute_name");
		var table_attr_parent = table_attr.parent();
		var task = table_attr_parent.closest(".task");
		var task_id = task.attr("id");
		attribute_name = attribute_name.replace(/\s/g, "");
		if (task_id) {
			var attribute_data = DBTableTaskPropertyObj.getTaskTableAttributeData(task_id, attribute_name);
			var new_attribute_name = table_attr.find(".name input").val().replace(/\s/g, "");
			if (!$.isPlainObject(attribute_data)) {
				attribute_data = {};
				if (!attribute_name && new_attribute_name) attribute_name = new_attribute_name;
			}
			var type = table_attr.find(".type select").val();
			attribute_data["type"] = type;
			attribute_data["name"] = new_attribute_name;
			attribute_data["length"] = table_attr.find(".type input").val();
			var key_type = table_attr.find(".key_type select").val();
			switch (key_type) {
				case "pk":
				case "pfk":
					attribute_data["primary_key"] = true;
					break;
				case "uk":
				case "fuk":
					attribute_data["primary_key"] = false;
					attribute_data["unique"] = true;
					break;
				default:
					attribute_data["primary_key"] = false;
					attribute_data["unique"] = false;
			}
			var column_simple_types = $.isPlainObject(DBTableTaskPropertyObj.column_simple_types) ? DBTableTaskPropertyObj.column_simple_types : {};
			var column_simple_custom_types = $.isPlainObject(DBTableTaskPropertyObj.column_simple_custom_types) ? DBTableTaskPropertyObj.column_simple_custom_types : {};
			var simple_props = type && column_simple_types.hasOwnProperty(type) ? column_simple_types[type] : (type && column_simple_custom_types.hasOwnProperty(type) ? column_simple_custom_types[type] : null);
			if (simple_props) {
				type = simple_props["type"];
				if ($.isArray(type)) type = type[0];
			}
			if (attribute_data["primary_key"]) {
				var column_numeric_types = $.isArray(DBTableTaskPropertyObj.column_numeric_types) ? DBTableTaskPropertyObj.column_numeric_types : [];
				attribute_data["null"] = false;
				attribute_data["unique"] = true;
				if (!type || ($.isArray(column_numeric_types) && $.inArray(type, column_numeric_types) != -1)) {
					var column_type_ignored_props = type && $.isPlainObject(DBTableTaskPropertyObj.column_types_ignored_props) && DBTableTaskPropertyObj.column_types_ignored_props.hasOwnProperty(type) && $.isArray(DBTableTaskPropertyObj.column_types_ignored_props[type]) ? DBTableTaskPropertyObj.column_types_ignored_props[type] : [];
					var is_unsigned_disabled = column_type_ignored_props && $.inArray("unsigned", column_type_ignored_props) != -1;
					attribute_data["unsigned"] = !is_unsigned_disabled ? true : false;
					var primary_keys_count = 0;
					var selects = table_attr_parent.find(".type select");
					for (var i = 0, t = selects.length; i < t; i++) {
						var select_key_type = $(selects[i]).val();
						if (select_key_type[0] == "p") primary_keys_count++;
					}
					if (primary_keys_count == 1) {
						var text = attribute_data["extra"];
						if (!text || ("" + text).toLowerCase().indexOf("auto_increment") == -1) {
							attribute_data["auto_increment"] = true;
							attribute_data["extra"] = text + (text ? " " : "") + "auto_increment";
						}
					} else attribute_data["auto_increment"] = false;
				} else attribute_data["auto_increment"] = false;
			} else attribute_data["auto_increment"] = false;
			if (simple_props) {
				for (var prop_name in simple_props)
					if (prop_name != "name" && prop_name != "length") {
						var prop_value = simple_props[prop_name];
						if ($.isArray(prop_value)) prop_value = prop_value[0];
						attribute_data[prop_name] = prop_value;
					} if (prop_name == "default" && prop_value != null && typeof prop_value != "undefined" && !attribute_data["has_default"]) attribute_data["has_default"] = true;
				if (!attribute_data["auto_increment"] && simple_props.hasOwnProperty("extra") && typeof simple_props["extra"] == "string" && simple_props["extra"].toLowerCase().indexOf("auto_increment") != -1) attribute_data["auto_increment"] = true;
				else if (simple_props.hasOwnProperty("auto_increment")) attribute_data["auto_increment"] = simple_props["auto_increment"];
			}
			var attribute_index = null;
			var attribute_dec = 0;
			var inputs = table_attr_parent.find(".name input");
			for (var i = 0, t = inputs.length; i < t; i++) {
				var name = ("" + inputs[i].value).replace(/\s/g, "");
				if (name == "") attribute_dec++;
				else if (attribute_data["name"] == name) {
					attribute_index = i - attribute_dec;
					break;
				}
			}
			DBTableTaskPropertyObj.updateTaskPropertiesAttribute(task_id, attribute_name, attribute_data, attribute_index);
			if ($(elm).parent().is(".name") && new_attribute_name) table_attr.attr("data_attribute_name", new_attribute_name);
		}
	},
	getShortTableAttributeRowKeyTypeOptions: function(key_type) {
		var keys_options = '';
		if (key_type && $.inArray(key_type, ["fk", "pfk", "fuk"]) != -1) keys_options = '<option value="fk"' + (key_type == "fk" ? ' selected' : '') + ' title="' + this.getShortTableAttributeKeyTypeLabel("fk") + '">FK</option>' + '<option value="pk"' + (key_type == "pfk" ? ' selected' : '') + ' title="' + this.getShortTableAttributeKeyTypeLabel("pfk") + '">PFK</option>' + '<option value="uk"' + (key_type == "fuk" ? ' selected' : '') + ' title="' + this.getShortTableAttributeKeyTypeLabel("fuk") + '">FUK</option>';
		else keys_options = '<option value="" title="No key"></option>' + '<option value="pk"' + (key_type == "pk" ? ' selected' : '') + ' title="' + this.getShortTableAttributeKeyTypeLabel("pk") + '">PK</option>' + '<option value="uk"' + (key_type == "uk" ? ' selected' : '') + ' title="' + this.getShortTableAttributeKeyTypeLabel("uk") + '">UK</option>';
		return keys_options;
	},
	getShortTableAttributeKeyType: function(data, fks) {
		var key_type = "";
		if ($.isPlainObject(data) && data["name"]) {
			var fk = $.isArray(fks) && $.inArray(data["name"], fks) != -1;
			if (fk) key_type = data["primary_key"] ? "pfk" : (data["unique"] ? "fuk" : "fk");
			else if (data["primary_key"]) key_type = "pk";
			else if (data["unique"]) key_type = "uk";
		}
		return key_type;
	},
	getShortTableAttributeKeyTypeLabel: function(key_type) {
		return key_type == "pfk" ? "Primary and Foreign Key" : (key_type == "fuk" ? "Foreign and Unique Key" : (key_type == "fk" ? "Foreign Key" : (key_type == "pk" ? "Primary Key" : (key_type == "uk" ? "Unique Key" : ""))));
	},
	getShortTableAttributeKeyTypeOptionValue: function(key_type) {
		return key_type == "pfk" ? "pk" : (key_type == "fuk" ? "uk" : key_type);
	},
	getShortTableAttributeRowTitle: function(data) {
		if (!$.isPlainObject(data)) data = {};
		var type = data["type"];
		var original_type = data["original_type"];
		var simple_props = $.isPlainObject(this.column_simple_types) ? this.column_simple_types[type] : null;
		var simple_props_exists = simple_props && simple_props["label"];
		var column_type_ignored_props = original_type && $.isPlainObject(this.column_types_ignored_props) && this.column_types_ignored_props.hasOwnProperty(original_type) && $.isArray(this.column_types_ignored_props[original_type]) ? this.column_types_ignored_props[original_type] : [];
		var is_numeric = $.isArray(this.column_numeric_types) && $.inArray(original_type, this.column_numeric_types) != -1;
		var key_type = data["key_type"] ? data["key_type"] : (data["primary_key"] ? "pk" : (data["unique"] ? "uk" : ""));
		var is_length_disabled = !original_type || $.inArray("length", column_type_ignored_props) != -1;
		var is_unsigned_disabled = !original_type || $.inArray("unsigned", column_type_ignored_props) != -1;
		var is_null_disabled = original_type && $.inArray("null", column_type_ignored_props) != -1;
		var is_auto_increment_disabled = original_type && $.inArray("auto_increment", column_type_ignored_props) != -1;
		var is_default_disabled = original_type && $.inArray("default", column_type_ignored_props) != -1;
		var is_extra_disabled = original_type && $.inArray("extra", column_type_ignored_props) != -1;
		var name_label = data["name"] ? data["name"] : "";
		var key_label = this.getShortTableAttributeKeyTypeLabel(key_type);
		var type_label = type ? (simple_props_exists ? simple_props["label"] : stringToUCWords(type)) : "";
		var length_label = !is_length_disabled && (data["length"] || parseInt(data["length"]) === 0) ? data["length"] : "";
		var unsigned_label = !is_unsigned_disabled && data["unsigned"] ? "unsigned" : "";
		var null_label = !is_null_disabled && data["is_null"] ? "null" : "";
		var auto_increment_label = !is_auto_increment_disabled && data["auto_increment"] ? "auto_increment" : "";
		var default_label = !is_default_disabled && data["has_default"] ? data["default_value"] : "";
		var extra_label = !is_extra_disabled ? data["extra"] : "";
		var title = "Name: " + name_label.replace(/"/g, "&quot;") + "\n" + (key_label ? "Key: " + key_label + "\n" : "") + "Type: " + type_label + (simple_props_exists && original_type ? " (" + original_type + ")" : "") + "\n" + "Length: " + length_label + "\n" + (is_numeric ? "Unsigned: " + (unsigned_label ? "Yes" : "No") + "\n" : "") + "Null: " + (null_label ? "Yes" : "No") + "\n" + (auto_increment_label ? "Auto Increment: Yes\n" : "") + (default_label ? "Default value: " + default_label + "\n" : "") + (extra_label ? "Extra: " + extra_label : "");
		return title;
	},
	prepareShortTableAttributesRowTitle: function(task_id) {
		if (task_id) {
			var WF = myWFObj.getTaskFlowChart();
			var task = WF.TaskFlow.getTaskById(task_id);
			var table_attrs = task.find(" > ." + WF.TaskFlow.task_eps_class_name + " .table_attrs .table_attr");
			if (table_attrs) {
				var fks = this.getTaskForeignKeys(task_id);
				var data_by_attribute_name = this.getTaskTableAttributesData(task_id, fks);
				for (var i = 0; i < table_attrs.length; i++) {
					var table_attr = $(table_attrs[i]);
					var name = table_attr.attr("data_attribute_name");
					var attribute_data = data_by_attribute_name[name];
					if (attribute_data) {
						var title = DBTableTaskPropertyObj.getShortTableAttributeRowTitle(attribute_data);
						table_attr.attr("title", title);
					}
				}
			}
		}
	},
	prepareShortTableAttributeRowTitle: function(task_id, attribute_name) {
		if (task_id) {
			var WF = myWFObj.getTaskFlowChart();
			var task = WF.TaskFlow.getTaskById(task_id);
			var table_attrs = task.find(" > ." + WF.TaskFlow.task_eps_class_name + " .table_attrs .table_attr");
			if (table_attrs) {
				for (var i = 0; i < table_attrs.length; i++) {
					var table_attr = $(table_attrs[i]);
					var name = table_attr.attr("data_attribute_name");
					if (name == attribute_name) {
						fks = this.getTaskForeignKeys(task_id);
						var attribute_data = this.getTaskTableAttributeData(task_id, attribute_name, fks);
						if (attribute_data) {
							var title = DBTableTaskPropertyObj.getShortTableAttributeRowTitle(attribute_data);
							table_attr.attr("title", title);
						}
						break;
					}
				}
			}
		}
	},
	updateShortTableForeignKeys: function(task_id) {
		if (task_id) {
			var WF = myWFObj.getTaskFlowChart();
			var task = WF.TaskFlow.getTaskById(task_id);
			var table_attrs = task.find(" > ." + WF.TaskFlow.task_eps_class_name + " .table_attrs .table_attr");
			if (table_attrs) {
				var fks = this.getTaskForeignKeys(task_id);
				var data_by_attribute_name = this.getTaskTableAttributesData(task_id, fks);
				for (var i = 0; i < table_attrs.length; i++) {
					var table_attr = $(table_attrs[i]);
					var name = table_attr.attr("data_attribute_name");
					var key_type_select = table_attr.find(".key_type select");
					var key_type = key_type_select.val();
					var attribute_data = data_by_attribute_name[name];
					if (attribute_data) {
						var new_key_type = this.getShortTableAttributeKeyType(attribute_data, fks);
						var keys_options = this.getShortTableAttributeRowKeyTypeOptions(new_key_type);
						var option_value = this.getShortTableAttributeKeyTypeOptionValue(new_key_type);
						key_type_select.html(keys_options).val(option_value);
						var title = this.getShortTableAttributeRowTitle(attribute_data);
						table_attr.attr("title", title);
					}
				}
			}
		}
	},
	updateTaskPropertiesFromTableAttributes: function(task_id, table_attributes) {
		var task_property_values = myWFObj.getTaskFlowChart().TaskFlow.tasks_properties[task_id];
		task_property_values = task_property_values ? task_property_values : {};
		for (var i = 0; i < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; i++) {
			var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[i];
			task_property_values["table_attr_" + prop_name + "s"] = [];
		}
		for (var attr_name in table_attributes) {
			var prop = table_attributes[attr_name];
			if (prop) {
				var type = prop["type"];
				for (var i = 0; i < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; i++) {
					var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[i];
					var prop_value = prop[prop_name];
					if (prop_name == "type") prop_value = type;
					else if (prop_name == "has_default") prop_value = prop["default"] ? 1 : "";
					else if (prop_name == "default" || prop_name == "charset" || prop_name == "collation") prop_value = prop[prop_name] ? prop[prop_name] : "";
					else if ($.inArray(prop_name, ["primary_key", "null", "unique", "unsigned", "auto_increment"]) != -1) prop_value = checkIfValueIsTrue(prop_value) ? 1 : "";
					task_property_values["table_attr_" + prop_name + "s"].push(prop_value);
				}
			}
		}
		myWFObj.getTaskFlowChart().TaskFlow.tasks_properties[task_id] = task_property_values;
		this.prepareShortTableAttributes(task_id, task_property_values);
	},
	getTableAttributeHtml: function(data) {
		var column_types_hidden_props = $.isArray(DBTableTaskPropertyObj.column_types_hidden_props) ? DBTableTaskPropertyObj.column_types_hidden_props : [];
		var charsets = $.isPlainObject(DBTableTaskPropertyObj.column_charsets) ? DBTableTaskPropertyObj.column_charsets : {};
		var collations = $.isPlainObject(DBTableTaskPropertyObj.column_collations) ? DBTableTaskPropertyObj.column_collations : {};
		var types = $.isPlainObject(DBTableTaskPropertyObj.column_types) ? DBTableTaskPropertyObj.column_types : {};
		var primary_key = false,
			name = "",
			type, length = "",
			is_null = false,
			unsigned = false,
			unique = false,
			auto_increment = false,
			has_default = false,
			default_value = "",
			extra = "",
			charset = "",
			collation = "",
			comment = "";
		if (data) {
			primary_key = checkIfValueIsTrue(data.primary_key);
			name = data.name ? data.name : "";
			type = data.type;
			length = data["length"] || parseInt(data["length"]) === 0 ? data["length"] : "";
			is_null = checkIfValueIsTrue(data["null"]);
			unsigned = checkIfValueIsTrue(data.unsigned);
			unique = checkIfValueIsTrue(data.unique);
			auto_increment = checkIfValueIsTrue(data.auto_increment);
			has_default = checkIfValueIsTrue(data.has_default);
			default_value = data["default"] && data["default"] != null ? data["default"] : "";
			extra = data.extra ? data.extra : "";
			charset = data.charset ? data.charset : "";
			collation = data.collation ? data.collation : "";
			comment = data.comment ? data.comment : "";
			if (default_value) has_default = true;
		}
		is_null = primary_key ? false : is_null;
		unique = primary_key ? true : unique;
		var column_types_ignored_props = $.isPlainObject(DBTableTaskPropertyObj.column_types_ignored_props) ? DBTableTaskPropertyObj.column_types_ignored_props : {};
		var column_type_ignored_props = type && column_types_ignored_props.hasOwnProperty(type) && $.isArray(column_types_ignored_props[type]) ? column_types_ignored_props[type] : [];
		var is_length_disabled = !type || $.inArray("length", column_type_ignored_props) != -1;
		var is_unsigned_disabled = !type || $.inArray("unsigned", column_type_ignored_props) != -1;
		var is_null_disabled = type && $.inArray("null", column_type_ignored_props) != -1;
		var is_auto_increment_disabled = type && $.inArray("auto_increment", column_type_ignored_props) != -1;
		var is_default_disabled = type && $.inArray("default", column_type_ignored_props) != -1;
		var is_extra_disabled = type && $.inArray("extra", column_type_ignored_props) != -1;
		var is_charset_disabled = type && $.inArray("charset", column_type_ignored_props) != -1;
		var is_collation_disabled = type && $.inArray("collation", column_type_ignored_props) != -1;
		var is_comment_disabled = type && $.inArray("comment", column_type_ignored_props) != -1;
		var html = '<tr>' + '<td class="table_attr_primary_key"><input type="checkbox" class="task_property_field" name="table_attr_primary_keys[]" ' + (primary_key ? 'checked="checked"' : '') + ' value="1" onClick="DBTableTaskPropertyObj.onClickCheckBox(this)" /></td>' + '<td class="table_attr_name"><input type="text" class="task_property_field" name="table_attr_names[]" value="' + name + '" onBlur="DBTableTaskPropertyObj.onBlurTableAttributeInputBox(this)" /></td>' + '<td class="table_attr_type"><select class="task_property_field" name="table_attr_types[]" onChange="DBTableTaskPropertyObj.onChangeSelectBox(this)"><option></option>';
		for (var key in types) html += '<option value="' + key + '" ' + (key == type ? "selected" : "") + '>' + types[key] + '</option>';
		if (type && !types.hasOwnProperty(type)) html += '<option value="' + type + '">' + type + ' - NON DEFAULT</option>';
		html += '</select></td>' + '<td class="table_attr_length"' + ($.inArray("length", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '><input type="text" class="task_property_field" name="table_attr_lengths[]" value="' + length + '" ' + (is_length_disabled ? 'disabled="disabled"' : '') + ' /></td>' + '<td class="table_attr_null"' + ($.inArray("null", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '><input type="checkbox" class="task_property_field" name="table_attr_nulls[]" ' + (is_null ? 'checked="checked"' : '') + ' value="1" ' + (is_null_disabled ? 'disabled="disabled"' : '') + ' /></td>' + '<td class="table_attr_unsigned"' + ($.inArray("unsigned", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '><input type="checkbox" class="task_property_field" name="table_attr_unsigneds[]" ' + (unsigned ? 'checked="checked"' : '') + ' value="1" ' + (is_unsigned_disabled ? 'disabled="disabled"' : '') + ' /></td>' + '<td class="table_attr_unique"' + ($.inArray("unique", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '><input type="checkbox" class="task_property_field" name="table_attr_uniques[]" ' + (unique ? 'checked="checked"' : '') + ' value="1" /></td>' + '<td class="table_attr_auto_increment"' + ($.inArray("auto_increment", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '><input type="checkbox" class="task_property_field" name="table_attr_auto_increments[]" ' + (auto_increment ? 'checked="checked"' : '') + ' value="1" ' + (is_auto_increment_disabled ? 'disabled="disabled"' : '') + ' /></td>' + '<td class="table_attr_has_default"' + ($.inArray("default", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '><input type="checkbox" class="task_property_field" name="table_attr_has_defaults[]" ' + (has_default ? 'checked="checked"' : '') + ' value="1" ' + (is_default_disabled ? 'disabled="disabled"' : '') + ' onClick="DBTableTaskPropertyObj.onClickCheckBox(this)" title="Enable/Disable Default value" /></td>' + '<td class="table_attr_default"' + ($.inArray("default", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '><input type="text" class="task_property_field" name="table_attr_defaults[]" value="' + default_value + '" ' + (has_default && !is_default_disabled ? '' : 'disabled="disabled"') + ' /></td>' + '<td class="table_attr_extra"' + ($.inArray("extra", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '><input type="text" class="task_property_field" name="table_attr_extras[]" value="' + extra + '" ' + (is_extra_disabled ? 'disabled="disabled"' : '') + ' /></td>' + '<td class="table_attr_charset"' + ($.inArray("charset", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '><select class="task_property_field" name="table_attr_charsets[]" ' + (is_charset_disabled ? 'disabled="disabled"' : '') + '><option value="">-- Default --</option>';
		var charset_exists = false;
		var charset_lower = charset ? ("" + charset).toLowerCase() : "";
		$.each(charsets, function(charset_id, charset_label) {
			var selected = ("" + charset_id).toLowerCase() == charset_lower;
			html += '<option value="' + charset_id + '" ' + (selected ? "selected" : "") + '>' + charset_label + '</option>';
			if (selected) charset_exists = true;
		});
		if (charset && !charset_exists) html += '<option value="' + charset + '" selected>' + charset + ' - NON DEFAULT</option>';
		html += '</select></td>' + '<td class="table_attr_collation"' + ($.inArray("collation", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '><select class="task_property_field" name="table_attr_collations[]" ' + (is_collation_disabled ? 'disabled="disabled"' : '') + '><option value="">-- Default --</option>';
		var collation_exists = false;
		var collation_lower = collation ? ("" + collation).toLowerCase() : "";
		$.each(collations, function(collation_id, collation_label) {
			var selected = ("" + collation_id).toLowerCase() == collation_lower;
			html += '<option value="' + collation_id + '" ' + (selected ? "selected" : "") + '>' + collation_label + '</option>';
			if (selected) collation_exists = true;
		});
		if (collation && !collation_exists) html += '<option value="' + collation + '" selected>' + collation + ' - NON DEFAULT</option>';
		html += '</select></td>' + '<td class="table_attr_comment"' + ($.inArray("comment", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '><input type="text" class="task_property_field" name="table_attr_comments[]" value="' + comment + '" ' + (is_comment_disabled ? 'disabled="disabled"' : '') + ' /></td>' + '<td class="table_attr_icons">' + '	<a class="icon move_up" onClick="DBTableTaskPropertyObj.moveUpTableAttribute(this)">move up</a>' + '	<a class="icon move_down" onClick="DBTableTaskPropertyObj.moveDownTableAttribute(this)">move down</a>' + '	<a class="icon delete" onClick="DBTableTaskPropertyObj.removeTableAttribute(this)">remove</a>' + '</td>' + '</tr>';
		return html;
	},
	onClickCheckBox: function(elm) {
		var j_elm = $(elm);
		var j_parent = j_elm.parent();
		if (j_parent.hasClass("table_attr_has_default")) {
			var default_field = j_parent.parent().find('.table_attr_default input');
			if (elm.checked) default_field.removeAttr('disabled');
			else default_field.attr('disabled', 'disabled').val('');
		} else if (j_elm.is(":checked") && j_parent.hasClass("table_attr_primary_key")) {
			var column_numeric_types = $.isArray(DBTableTaskPropertyObj.column_numeric_types) ? DBTableTaskPropertyObj.column_numeric_types : [];
			var j_grand_parent = j_parent.parent();
			var type = j_grand_parent.find('.table_attr_type select').val();
			var primary_keys_count = j_grand_parent.parent().find(".table_attr_primary_key input:checked").length;
			j_grand_parent.find('.table_attr_null input').removeAttr("checked").prop("checked", false);
			j_grand_parent.find('.table_attr_unique input').attr("checked", "checked").prop("checked", true);
			if (!type || ($.isArray(column_numeric_types) && $.inArray(type, column_numeric_types) != -1)) {
				var unsigned_input = j_grand_parent.find('.table_attr_unsigned input');
				if (!unsigned_input.is(":disabled")) unsigned_input.attr("checked", "checked").prop("checked", true);
				if (primary_keys_count == 1) {
					var extra = j_grand_parent.find('.table_attr_extra input');
					var text = extra.val();
					if (!text || ("" + text).toLowerCase().indexOf("auto_increment") == -1) {
						j_grand_parent.find('.table_attr_auto_increment input').attr("checked", "checked").prop("checked", true);
						extra.val(text + (text ? " " : "") + "auto_increment");
					}
				}
			}
		}
	},
	onChangeSelectBox: function(elm) {
		var j_elm = $(elm);
		var j_parent = j_elm.parent();
		if (j_parent.hasClass("table_attr_type")) {
			var value = j_elm.val();
			var tr = j_parent.parent();
			var length_field = tr.find('.table_attr_length input');
			var unsigned_field = tr.find(".table_attr_unsigned input");
			DBTableTaskPropertyObj.prepareAttributeSerialType(tr, value);
			value = j_elm.val();
			var column_types_ignored_props = $.isPlainObject(DBTableTaskPropertyObj.column_types_ignored_props) ? DBTableTaskPropertyObj.column_types_ignored_props : {};
			var column_type_ignored_props = value && column_types_ignored_props.hasOwnProperty(value) && $.isArray(column_types_ignored_props[value]) ? column_types_ignored_props[value] : [];
			tr.find("input, select").removeAttr('disabled');
			if (!value) {
				column_type_ignored_props.push("length");
				column_type_ignored_props.push("unsigned");
				column_type_ignored_props.push("auto_increment");
			} else if ($.inArray("length", column_type_ignored_props) == -1 && !$.isNumeric(("" + length_field.val()).replace(/\s/, ""))) {
				var column_mandatory_length_types = $.isPlainObject(DBTableTaskPropertyObj.column_mandatory_length_types) ? DBTableTaskPropertyObj.column_mandatory_length_types : {};
				var column_mandatory_length_type = value && column_mandatory_length_types.hasOwnProperty(value) ? column_mandatory_length_types[value] : null;
				if ($.isNumeric(column_mandatory_length_type) || column_mandatory_length_type) length_field.val(column_mandatory_length_type);
			}
			if ($.inArray("default", column_type_ignored_props) != -1) column_type_ignored_props.push("has_default");
			for (var i = 0; i < column_type_ignored_props.length; i++) {
				var field_name = column_type_ignored_props[i];
				var td = tr.find(".table_attr_" + field_name);
				td.find("input, select").attr('disabled', 'disabled');
				td.find("input[type=text]").val('');
				td.find("input[type=checkbox]").removeAttr("checked").prop("checked", false);
			}
			DBTableTaskPropertyObj.onClickCheckBox(tr.find(".table_attr_has_default input")[0]);
		}
	},
	prepareAttributeSerialType: function(tr, type) {},
	onBlurTableAttributeInputBox: function(elm) {
		elm = $(elm);
		var name = elm.val();
		if (name) {
			name = normalizeTaskTableName(name);
			if (name.indexOf(".") != -1) name = name.replace(/\.+/, "");
			elm.val(name);
			isTaskTableNameAdvisable(name);
		}
	},
	addTableAttribute: function(elm) {
		var html = DBTableTaskPropertyObj.getTableAttributeHtml();
		var item = $(html);
		var task_html_elm = $(elm).parent().closest('.db_table_task_html');
		if (typeof DBTableTaskPropertyObj.on_add_table_attribute_callback == "function") DBTableTaskPropertyObj.on_add_table_attribute_callback(item);
		if (task_html_elm.hasClass("attributes_list_shown")) {
			var column_names = DBTableTaskPropertyObj.getTableColumnNames(task_html_elm.find("table"));
			DBTableTaskPropertyObj.convertTableRowToListItem(task_html_elm.find(".list_attrs"), item, column_names);
		} else task_html_elm.find(".table_attrs").append(item);
	},
	removeTableAttribute: function(elm) {
		$(elm).parent().parent().remove();
	},
	moveUpTableAttribute: function(elm) {
		var item = $(elm).parent().parent();
		if (item.prev()[0]) item.parent()[0].insertBefore(item[0], item.prev()[0]);
	},
	moveDownTableAttribute: function(elm) {
		var item = $(elm).parent().parent();
		if (item.next()[0]) item.parent()[0].insertBefore(item.next()[0], item[0]);
	},
	getTaskForeignKeys: function(task_id) {
		var fks = [];
		var source_connections = myWFObj.getTaskFlowChart().TaskFlow.getSourceConnections(task_id);
		var target_connections = myWFObj.getTaskFlowChart().TaskFlow.getTargetConnections(task_id);
		var connections = source_connections.concat(target_connections);
		for (var i = 0; i < connections.length; i++) {
			var connection = connections[i];
			var overlay = connection.getParameter("connection_exit_overlay");
			var props = myWFObj.getTaskFlowChart().TaskFlow.connections_properties[connection.id];
			if (overlay && props) {
				if (connection.sourceId == task_id && overlay != "One To Many") {
					arr = props.source_columns;
					if (arr) {
						arr = !$.isArray(arr) && !$.isPlainObject(arr) ? [arr] : arr;
						$.each(arr, function(k, item) {
							fks.push(item);
						});
					}
				}
				if (connection.targetId == task_id && overlay != "Many To One") {
					arr = props.target_columns;
					if (arr) {
						arr = !$.isArray(arr) && !$.isPlainObject(arr) ? [arr] : arr;
						$.each(arr, function(k, item) {
							fks.push(item);
						});
					}
				}
			}
		}
		return fks;
	},
	updateSimpleAttributesHtmlWithTableAttributes: function(elm, do_not_confirm) {
		var WF = myWFObj.getTaskFlowChart();
		if (do_not_confirm || confirm("Do you wish to convert the Advanced UI's attributes into the Simple UI?")) {
			var task_html_elm = $(elm).closest(".db_table_task_html");
			var task_property_values = {};
			var selector = task_html_elm.hasClass("attributes_list_shown") ? ".list_attributes .list_attrs" : ".table_attrs";
			var selector_elm = task_html_elm.find(selector);
			var query_string = WF.Property.getPropertiesQueryStringFromHtmlElm(selector_elm, "task_property_field");
			try {
				parse_str(query_string, task_property_values);
			} catch (e) {
				if (console && console.log) {
					console.log(e);
					console.log("Error in updateSimpleAttributesHtmlWithTableAttributes method, trying to execute the parse_str function with query_string: " + query_string);
				}
			}
			var html = "";
			if (task_property_values.hasOwnProperty("table_attr_names")) $.each(task_property_values.table_attr_names, function(i, table_attr_name) {
				var data = {};
				for (var j = 0; j < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; j++) {
					var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[j];
					var prop_value = task_property_values["table_attr_" + prop_name + 's'][i];
					data[prop_name] = prop_value;
				}
				html += DBTableTaskPropertyObj.getSimpleAttributeHtml(data);
			});
			var ul = task_html_elm.find(".simple_attributes > ul");
			ul.children("li:not(.no_simple_attributes)").remove();
			ul.append(html);
			if (html) ul.children(".no_simple_attributes").hide();
			else ul.children(".no_simple_attributes").show();
			if (typeof DBTableTaskPropertyObj.on_update_simple_attributes_html_with_table_attributes_callback == "function") DBTableTaskPropertyObj.on_update_simple_attributes_html_with_table_attributes_callback(elm);
		}
		var taskflowchart = $("#" + WF.TaskFlow.main_tasks_flow_obj_id).parent().closest(".taskflowchart");
		if (!taskflowchart.is(".fixed_properties, .fixed_side_properties")) WF.getMyFancyPopupObj().getPopup().css({
			width: "",
			height: ""
		});
	},
	updateTableAttributesHtmlWithSimpleAttributes: function(elm, do_not_confirm) {
		var WF = myWFObj.getTaskFlowChart();
		if (do_not_confirm || confirm("Do you wish to convert the Simple UI's attributes into the Advanced UI?")) {
			var task_html_elm = $(elm).closest(".db_table_task_html");
			var lis = task_html_elm.find(".simple_attributes > ul > li:not(.no_simple_attributes)");
			var html = '';
			for (var i = 0; i < lis.length; i++) {
				var data = DBTableTaskPropertyObj.convertSimpleAttributeIntoTableAttributeData($(lis[i]));
				html += DBTableTaskPropertyObj.getTableAttributeHtml(data);
			}
			task_html_elm.find(".table_attrs").html(html);
			if (typeof DBTableTaskPropertyObj.on_update_table_attributes_html_with_simple_attributes_callback == "function") DBTableTaskPropertyObj.on_update_table_attributes_html_with_simple_attributes_callback(elm);
			if (task_html_elm.hasClass("attributes_list_shown")) DBTableTaskPropertyObj.convertTableToList(elm);
		}
		var taskflowchart = $("#" + WF.TaskFlow.main_tasks_flow_obj_id).parent().closest(".taskflowchart");
		if (!taskflowchart.is(".fixed_properties, .fixed_side_properties")) WF.getMyFancyPopupObj().getPopup().css({
			width: "",
			height: ""
		});
	},
	convertSimpleAttributesIntoTableAttributesData: function(elm) {
		var task_html_elm = $(elm).closest(".db_table_task_html");
		var lis = task_html_elm.find(".simple_attributes > ul > li:not(.no_simple_attributes)");
		var task_property_values = {};
		for (var i = 0; i < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; i++) {
			var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[i];
			task_property_values["table_attr_" + prop_name + "s"] = [];
		}
		for (var i = 0; i < lis.length; i++) {
			var prop = DBTableTaskPropertyObj.convertSimpleAttributeIntoTableAttributeData($(lis[i]));
			for (var j = 0; j < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; j++) {
				var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[j];
				task_property_values["table_attr_" + prop_name + "s"].push(prop[prop_name]);
			}
		}
		return task_property_values;
	},
	convertSimpleAttributeIntoTableAttributeData: function(li) {
		var type_select = li.find("select.simple_attr_type");
		var type = type_select.val();
		var column_simple_types = $.isPlainObject(DBTableTaskPropertyObj.column_simple_types) ? DBTableTaskPropertyObj.column_simple_types : {};
		var column_simple_custom_types = $.isPlainObject(DBTableTaskPropertyObj.column_simple_custom_types) ? DBTableTaskPropertyObj.column_simple_custom_types : {};
		if (type) {
			if (column_simple_types.hasOwnProperty(type)) type = column_simple_types[type]["type"];
			else if (column_simple_custom_types.hasOwnProperty(type)) type = column_simple_custom_types[type]["type"];
			if ($.isArray(type)) {
				var original_type = type_select.find("option:selected").attr("original_type");
				if (original_type && $.inArray(original_type, type) != -1) type = original_type;
				else type = type[0];
			}
		}
		var data = {};
		for (var i = 0; i < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; i++) {
			var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[i];
			var input_prop_name = prop_name == "null" ? "not_null" : prop_name;
			var field_elm = li.find("input.simple_attr_" + input_prop_name);
			if (prop_name == "type") data[prop_name] = type;
			else if (field_elm.attr("type") == "checkbox") {
				data[prop_name] = field_elm.is(":checked");
				if (prop_name == "null") data[prop_name] = data[prop_name] ? false : true;
			} else if (!field_elm[0] || field_elm[0].hasAttribute("disabled")) data[prop_name] = "";
			else data[prop_name] = field_elm.val();
		}
		return data;
	},
	getSimpleAttributeHtml: function(data) {
		var column_types_hidden_props = $.isArray(DBTableTaskPropertyObj.column_types_hidden_props) ? DBTableTaskPropertyObj.column_types_hidden_props : [];
		var types = $.isPlainObject(DBTableTaskPropertyObj.column_types) ? DBTableTaskPropertyObj.column_types : {};
		var column_simple_types = $.isPlainObject(DBTableTaskPropertyObj.column_simple_types) ? DBTableTaskPropertyObj.column_simple_types : {};
		var column_simple_custom_types = $.isPlainObject(DBTableTaskPropertyObj.column_simple_custom_types) ? DBTableTaskPropertyObj.column_simple_custom_types : {};
		var column_simple_types_exists = !$.isEmptyObject(column_simple_types);
		var primary_key = false,
			name = "",
			type, original_type, length = "",
			is_null = false,
			unsigned = false,
			unique = false,
			auto_increment = false,
			has_default = false,
			default_value = "",
			extra = "",
			charset = "",
			collation = "",
			comment = "";
		if (data) {
			primary_key = checkIfValueIsTrue(data.primary_key);
			name = data.name ? data.name : "";
			type = data.type;
			original_type = data.type;
			length = data["length"] || parseInt(data["length"]) === 0 ? data["length"] : "";
			is_null = checkIfValueIsTrue(data["null"]);
			unsigned = checkIfValueIsTrue(data.unsigned);
			unique = checkIfValueIsTrue(data.unique);
			auto_increment = checkIfValueIsTrue(data.auto_increment);
			has_default = checkIfValueIsTrue(data.has_default);
			default_value = data["default"] && data["default"] != null ? data["default"] : "";
			extra = data.extra ? data.extra : "";
			charset = data.charset ? data.charset : "";
			collation = data.collation ? data.collation : "";
			comment = data.comment ? data.comment : "";
			if (default_value) has_default = true;
		}
		var column_types_ignored_props = $.isPlainObject(DBTableTaskPropertyObj.column_types_ignored_props) ? DBTableTaskPropertyObj.column_types_ignored_props : {};
		var column_type_ignored_props = type && column_types_ignored_props.hasOwnProperty(type) && $.isArray(column_types_ignored_props[type]) ? column_types_ignored_props[type] : [];
		if (column_simple_types_exists && type) {
			var current_simple_props = {
				name: name,
				primary_key: primary_key,
				type: type,
				length: length,
				"null": is_null,
				unsigned: unsigned,
				unique: unique,
				auto_increment: auto_increment,
				"default": default_value,
				extra: extra,
				charset: charset,
				collation: collation,
				comment: comment
			};
			var simple_type = DBTableTaskPropertyObj.isSimpleAttribute(current_simple_props);
			var simple_props = null;
			if (simple_type) {
				type = simple_type;
				simple_props = column_simple_types[simple_type];
				if (!auto_increment && simple_props.hasOwnProperty("extra") && typeof simple_props["extra"] == "string" && simple_props["extra"].toLowerCase().indexOf("auto_increment") != -1) auto_increment = true;
				else if (simple_props.hasOwnProperty("auto_increment")) auto_increment = simple_props["auto_increment"];
			}
			if (primary_key && (!simple_type || !simple_props["primary_key"])) {
				var column_numeric_types = $.isArray(DBTableTaskPropertyObj.column_numeric_types) ? DBTableTaskPropertyObj.column_numeric_types : [];
				var simple_type = "simple_manual_primary_key";
				var is_auto_increment = auto_increment || ("" + extra).toLowerCase().indexOf("auto_increment") != -1;
				if (is_auto_increment) simple_type = "simple_auto_primary_key";
				else if ($.isArray(column_numeric_types) && $.inArray(type, column_numeric_types) != -1) simple_type = "simple_fk_primary_key";
				if (simple_props) {
					current_simple_props["auto_increment"] = auto_increment;
					for (var k in simple_props)
						if (k != "primary_key" && k != "auto_increment") current_simple_props[k] = simple_props[k];
				}
				var key = simple_type + "_" + type;
				var type_label = stringToUCWords(type.replace(/_/g, " "));
				column_simple_custom_types[key] = current_simple_props;
				if (column_simple_types.hasOwnProperty(simple_type)) column_simple_custom_types[key]["label"] = column_simple_types[simple_type]["label"] + " - " + type_label;
				else column_simple_custom_types[key]["label"] = stringToUCWords(simple_type.replace(/_/g, " ")) + " - " + type_label;
				type = key;
			}
		}
		is_null = primary_key ? false : is_null;
		unique = primary_key ? true : unique;
		var is_length_disabled = !type || $.inArray("length", column_type_ignored_props) != -1;
		var is_null_disabled = type && $.inArray("null", column_type_ignored_props) != -1;
		var is_default_disabled = type && $.inArray("default", column_type_ignored_props) != -1;
		var html = '<li>' + '<div class="header">' + '<input type="text" class="simple_attr_name" value="' + name + '" placeHolder="attribute name" onBlur="DBTableTaskPropertyObj.onBlurSimpleAttributeInputBox(this)" />' + '<select class="simple_attr_type" onChange="DBTableTaskPropertyObj.onChangeSimpleAttributeTypeSelectBox(this)">' + DBTableTaskPropertyObj.getSimpleAttributeTypeOptions(type, original_type) + '</select>' + '<a class="icon maximize" onClick="DBTableTaskPropertyObj.toggleSimpleAttributeProps(this)" title="Toggle other Properties">Toggle</a>' + '<a class="icon move_up" onClick="DBTableTaskPropertyObj.moveUpSimpleAttribute(this)">move up</a>' + '<a class="icon move_down" onClick="DBTableTaskPropertyObj.moveDownSimpleAttribute(this)">move down</a>' + '<a class="icon delete" onClick="DBTableTaskPropertyObj.removeSimpleAttributeProps(this)" title="Remove this attribute">Remove</a>' + '</div>' + '<ul>' + '<li' + ($.inArray("length", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '>' + '<label>Length:</label>' + '<input type="text" class="simple_attr_length" value="' + length + '" ' + (is_length_disabled ? 'disabled="disabled"' : '') + ' />' + '</li>' + '<li' + ($.inArray("null", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '>' + '<label>Is Mandatory:</label>' + '<input type="checkbox" class="simple_attr_not_null" ' + (!is_null ? 'checked="checked"' : '') + ' value="1" ' + (is_null_disabled ? 'disabled="disabled"' : '') + ' />' + '</li>' + '<li' + ($.inArray("default", column_types_hidden_props) != -1 ? ' style="display:none;"' : '') + '>' + '<label>Default Value:</label>' + '<input type="checkbox" class="simple_attr_has_default" ' + (has_default ? 'checked="checked"' : '') + ' value="1" ' + (is_default_disabled ? 'disabled="disabled"' : '') + ' onClick="DBTableTaskPropertyObj.onClickSimpleAttributeHasDefaultCheckBox(this)" title="Enable/Disable Default value" />' + '<input type="text" class="simple_attr_default" value="' + default_value + '" placeHolder="write default value" title="write default value" ' + (has_default && !is_default_disabled ? '' : 'disabled="disabled"') + ' />' + '</li>' + '</ul>' + '<input type="hidden" class="simple_attr_primary_key" value="' + (primary_key ? '1' : '') + '" />' + '<input type="hidden" class="simple_attr_unsigned" value="' + (unsigned ? '1' : '') + '" />' + '<input type="hidden" class="simple_attr_unique" value="' + (unique ? '1' : '') + '" />' + '<input type="hidden" class="simple_attr_auto_increment" value="' + (auto_increment ? '1' : '') + '" />' + '<input type="hidden" class="simple_attr_extra" value="' + extra + '" />' + '<input type="hidden" class="simple_attr_charset" value="' + charset + '" />' + '<input type="hidden" class="simple_attr_collation" value="' + collation + '">' + '<input type="hidden" class="simple_attr_comment" value="' + comment + '" />' + '</li>';
		return html;
	},
	getSimpleAttributeTypeOptions: function(type, original_type) {
		var types = $.isPlainObject(this.column_types) ? this.column_types : {};
		var column_simple_types = $.isPlainObject(this.column_simple_types) ? this.column_simple_types : {};
		var column_simple_custom_types = $.isPlainObject(this.column_simple_custom_types) ? this.column_simple_custom_types : {};
		var column_simple_types_exists = !$.isEmptyObject(column_simple_types);
		original_type = original_type ? original_type : "";
		var html = '<option value="">Please choose a type</option>' + '<option disabled></option>';
		if (column_simple_types_exists) {
			html += '<optgroup label="Simple Types">';
			for (var key in column_simple_types) {
				var props = column_simple_types[key];
				var label = props["label"] ? props["label"] : stringToUCWords(key);
				var title = label + ":";
				var original_type_html = original_type && $.isArray(props["type"]) && $.inArray(original_type, props["type"]) != -1 ? ' original_type="' + original_type + '"' : '';
				for (var k in props)
					if (k != "label") title += "\n- " + stringToUCWords(k) + ": " + props[k];
				html += '<option value="' + key + '" ' + (key == type ? "selected" : "") + ' title="' + title + '"' + original_type_html + '>' + label + '</option>';
			}
			html += '</optgroup>' + '<option disabled></option>';
		}
		var column_simple_custom_types_exists = !$.isEmptyObject(column_simple_custom_types);
		if (column_simple_types_exists || column_simple_custom_types_exists) html += '<optgroup label="Native Types">';
		for (var key in types) html += '<option value="' + key + '" ' + (key == type ? "selected" : "") + ' title="' + types[key] + '">' + types[key] + '</option>';
		if (column_simple_types_exists || column_simple_custom_types_exists) html += '</optgroup>';
		if (column_simple_custom_types_exists) {
			html += '<option disabled></option>' + '<optgroup label="Other Types - created dynamically">';
			for (var key in column_simple_custom_types) {
				var label = column_simple_custom_types[key]["label"] ? column_simple_custom_types[key]["label"] : key;
				html += '<option value="' + key + '" ' + (key == type ? "selected" : "") + ' title="' + label + '">' + label + '</option>';
			}
			html += '</optgroup>';
		}
		if (type && !types.hasOwnProperty(type) && !column_simple_types.hasOwnProperty(type) && !column_simple_custom_types.hasOwnProperty(type)) html += '<option value="' + type + '" title="' + type + '">' + type + ' - NON DEFAULT</option>';
		return html;
	},
	isSimpleAttribute: function(data) {
		if ($.isPlainObject(DBTableTaskPropertyObj.column_simple_types) && $.isPlainObject(data)) {
			var current_simple_props = data;
			if (typeof current_simple_props["extra"] == "string" && current_simple_props["extra"].toLowerCase().indexOf("auto_increment") != -1) {
				current_simple_props["auto_increment"] = true;
				current_simple_props["extra"] = current_simple_props["extra"].replace(/(^|\s)auto_increment(\s|$)/gi, " ");
			}
			for (var key in DBTableTaskPropertyObj.column_simple_types) {
				var props = DBTableTaskPropertyObj.column_simple_types[key];
				if (props.hasOwnProperty("auto_increment")) props["auto_increment"] = props["auto_increment"] || (props.hasOwnProperty("extra") && typeof props["extra"] == "string" && props["extra"].toLowerCase().indexOf("auto_increment") != -1);
				if (props.hasOwnProperty("extra") && typeof props["extra"] == "string") props["extra"] = props["extra"].replace(/(^|\s)auto_increment(\s|$)/gi, " ");
				var exists = true;
				for (var i = 0; i < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; i++) {
					var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[i];
					if (props.hasOwnProperty(prop_name)) {
						var props_value = props[prop_name];
						if (!$.isArray(props_value)) props_value = [props_value];
						var sub_exists = false;
						for (var j = 0; j < props_value.length; j++) {
							if (prop_name == "name") {
								if (DBTableTaskPropertyObj.isAttributeNameASimpleAttributeName(props_value[j], current_simple_props[prop_name])) {
									sub_exists = true;
									break;
								}
							} else if (props_value[j] == current_simple_props[prop_name] || (!props_value[j] && !current_simple_props[prop_name])) {
								sub_exists = true;
								break;
							}
						}
						if (!sub_exists) {
							exists = false;
							break;
						}
					}
				}
				if (exists) return key;
			}
		}
		return null;
	},
	isAttributeNameASimpleAttributeName: function(attribute_name, simple_prop_name) {
		if (!simple_prop_name) return true;
		else if (("" + attribute_name).length > 0) {
			var anl = attribute_name.toLowerCase();
			if ($.isArray(simple_prop_name)) {
				for (var i = 0, t = simple_prop_name.length; i < t; i++) {
					var n = simple_prop_name[i];
					if (anl.indexOf(("" + n).toLowerCase()) != -1) return true;
				}
			} else if (anl.indexOf(simple_prop_name.toLowerCase()) != -1) return true;
		}
		return false;
	},
	getSimpleTypeBasedInAttributeName: function(attribute_name) {
		var choosen_type = null;
		if (("" + attribute_name).length > 0) {
			var column_simple_types = $.isPlainObject(this.column_simple_types) ? this.column_simple_types : {};
			var column_simple_custom_types = $.isPlainObject(this.column_simple_custom_types) ? this.column_simple_custom_types : {};
			var anl = ("" + attribute_name).toLowerCase();
			var an_length = ("" + attribute_name).length;
			var get_length_func = function(simple_prop_name) {
				if (!$.isArray(simple_prop_name)) simple_prop_name = [simple_prop_name];
				var max_prop_length = null;
				for (var i = 0, t = simple_prop_name.length; i < t; i++) {
					var n = simple_prop_name[i];
					if (anl.indexOf(("" + n).toLowerCase()) != -1) {
						var l = ("" + n).length;
						if (an_length == l) return l;
						else if (max_prop_length === null || l > max_prop_length) max_prop_length = l;
					}
				}
				return max_prop_length;
			};
			var max_length = null;
			for (var simple_type in column_simple_types) {
				var simple_props = column_simple_types[simple_type];
				if ($.isPlainObject(simple_props) && simple_props.hasOwnProperty("name") && simple_props["name"]) {
					var length = get_length_func(simple_props["name"]);
					if ($.isNumeric(length) && (max_length === null || length > max_length || length == an_length)) {
						max_length = length;
						choosen_type = simple_type;
						if (length == an_length) return choosen_type;
					}
				}
			}
			for (var simple_type in column_simple_custom_types) {
				var simple_props = column_simple_custom_types[simple_type];
				if ($.isPlainObject(simple_props) && simple_props.hasOwnProperty("name") && simple_props["name"]) {
					var length = get_length_func(simple_props["name"]);
					if ($.isNumeric(length) && (max_length === null || length > max_length || length == an_length)) {
						max_length = length;
						choosen_type = simple_type;
						if (length == an_length) return choosen_type;
					}
				}
			}
		}
		return choosen_type;
	},
	onBlurSimpleAttributeInputBox: function(elm) {
		elm = $(elm);
		var attribute_name = elm.attr("data_attribute_name");
		var new_attribute_name = elm.val().replace(/\s/g, "");
		var is_attribute_name_different = attribute_name != new_attribute_name;
		if (is_attribute_name_different) {
			var type = this.getSimpleTypeBasedInAttributeName(new_attribute_name);
			if (type) {
				var select = elm.parent().find(".simple_attr_type");
				select.val(type);
				this.onChangeSimpleAttributeTypeSelectBox(select[0]);
			}
		}
		this.onBlurTableAttributeInputBox(elm);
		if (new_attribute_name) elm.attr("data_attribute_name", new_attribute_name);
	},
	onClickSimpleAttributeHasDefaultCheckBox: function(elm) {
		var default_field = $(elm).parent().children('input.simple_attr_default');
		if (elm.checked) default_field.removeAttr('disabled');
		else default_field.attr('disabled', 'disabled').val('');
	},
	onChangeSimpleAttributeTypeSelectBox: function(elm) {
		var j_elm = $(elm);
		var value = j_elm.val();
		var li = j_elm.parent().closest("li");
		var has_default_input = li.find("input.simple_attr_has_default");
		var column_simple_types = $.isPlainObject(DBTableTaskPropertyObj.column_simple_types) ? DBTableTaskPropertyObj.column_simple_types : {};
		var column_simple_custom_types = $.isPlainObject(DBTableTaskPropertyObj.column_simple_custom_types) ? DBTableTaskPropertyObj.column_simple_custom_types : {};
		var simple_props = value && column_simple_types.hasOwnProperty(value) ? column_simple_types[value] : (value && column_simple_custom_types.hasOwnProperty(value) ? column_simple_custom_types[value] : null);
		if (simple_props) {
			var is_auto_increment = (simple_props.hasOwnProperty("auto_increment") && simple_props["auto_increment"]) || (simple_props.hasOwnProperty("extra") && typeof simple_props["extra"] == "string" && simple_props["extra"].toLowerCase().indexOf("auto_increment") != -1);
			if (is_auto_increment) {
				var selects = li.parent().find("select.simple_attr_auto_increment");
				var auto_increments_count = 0;
				for (var i = 0; i < selects.length; i++)
					if ($(selects[i]).val() == 1) auto_increments_count++;
				if (auto_increments_count > 1) {
					j_elm.val("");
					value = "";
					myWFObj.getTaskFlowChart().StatusMessage.showError("You cannot have more than one auto increment field! Please choose another type...");
				}
			}
		}
		li.find("input.simple_attr_primary_key[type=checkbox]").removeAttr("checked").prop("checked", false);
		li.find("input.simple_attr_unique[type=checkbox]").removeAttr("checked").prop("checked", false);
		li.find("input.simple_attr_unsigned[type=checkbox]").removeAttr("checked").prop("checked", false);
		li.find("input.simple_attr_auto_increment[type=checkbox]").removeAttr("checked").prop("checked", false);
		var extra_elm = li.find("input.simple_attr_extra");
		var extra = extra_elm.val();
		extra = typeof extra == "string" ? extra.replace(/(^|\s)auto_increment(\s|$)/gi, " ") : extra;
		extra_elm.val(extra);
		if (simple_props) {
			if ($.isArray(simple_props["type"])) value = simple_props["type"][0];
			else value = simple_props["type"];
			li.find("input.simple_attr_length").val("");
			li.find("input.simple_attr_not_null").removeAttr("checked").prop("checked", false);
			has_default_input.removeAttr("checked").prop("checked", false);
			li.find("input.simple_attr_default").val("");
			for (var prop_name in simple_props) {
				var input_prop_name = prop_name;
				var prop_value = simple_props[prop_name];
				if ($.isArray(prop_value)) prop_value = prop_value[0];
				if (prop_name == "null") {
					prop_value = !prop_value;
					input_prop_name = "not_null";
				}
				var input = li.find("input.simple_attr_" + input_prop_name).first();
				if (input.attr("type") == "checkbox") {
					if (prop_value) input.attr("checked", "checked").prop("checked", true);
					else input.removeAttr("checked").prop("checked", false);
				} else if (input_prop_name == "name") {
					if (("" + input.val()).length == 0) input.val(prop_value);
				} else {
					input.val(prop_value);
					if (input_prop_name == "default" && prop_value != null && typeof prop_value != "undefined" && !has_default_input.is(":checked")) has_default_input.attr("checked", "checked").prop("checked", true);
				}
			}
			if (simple_props.hasOwnProperty("auto_increment") && simple_props["auto_increment"]) extra_elm.val(extra + " auto_increment");
		}
		DBTableTaskPropertyObj.prepareSimpleAttributeSerialType(li, value);
		value = j_elm.val();
		var column_types_ignored_props = $.isPlainObject(DBTableTaskPropertyObj.column_types_ignored_props) ? DBTableTaskPropertyObj.column_types_ignored_props : {};
		var column_type_ignored_props = value && column_types_ignored_props.hasOwnProperty(value) && $.isArray(column_types_ignored_props[value]) ? column_types_ignored_props[value] : [];
		li.find("input, select").removeAttr('disabled');
		if (!value) column_type_ignored_props.push("length");
		for (var i = 0; i < column_type_ignored_props.length; i++) {
			var field_name = column_type_ignored_props[i];
			if (field_name == "null") field_name = "not_null";
			var field = li.find(".simple_attr_" + field_name);
			field.attr('disabled', 'disabled');
			if (field.is("input[type=text]")) field.val('');
			else if (field.is("input[type=checkbox]")) field.removeAttr("checked").prop("checked", false);
		}
		DBTableTaskPropertyObj.onClickSimpleAttributeHasDefaultCheckBox(has_default_input[0]);
	},
	prepareSimpleAttributeSerialType: function(li, type) {},
	addSimpleAttribute: function(elm) {
		var html = DBTableTaskPropertyObj.getSimpleAttributeHtml();
		var item = $(html);
		var ul = $(elm).parent().closest(".simple_attributes").children("ul");
		ul.append(item);
		if (typeof DBTableTaskPropertyObj.on_add_simple_attribute_callback == "function") DBTableTaskPropertyObj.on_add_simple_attribute_callback(item);
		ul.children(".no_simple_attributes").hide();
	},
	toggleSimpleAttributeProps: function(elm) {
		elm = $(elm);
		var ul = elm.parent().closest("li").children("ul");
		if (ul.css("display") != "none") elm.removeClass("minimize").addClass("maximize");
		else elm.removeClass("maximize").addClass("minimize");
		ul.toggle("slow");
	},
	removeSimpleAttributeProps: function(elm) {
		elm = $(elm);
		var li = elm.parent().closest("li");
		var ul = li.parent();
		li.remove();
		if (ul.children(":not(.no_simple_attributes)").length > 0) ul.children(".no_simple_attributes").show();
	},
	moveUpSimpleAttribute: function(elm) {
		this.moveUpTableAttribute(elm);
	},
	moveDownSimpleAttribute: function(elm) {
		this.moveDownTableAttribute(elm);
	},
	initSelectedConnectionPropertiesData: function(connection) {
		var WF = myWFObj.getTaskFlowChart();
		var relationship = connection.getParameter("connection_exit_overlay");
		var source_table = WF.TaskFlow.getTaskLabelByTaskId(connection.sourceId);
		var target_table = WF.TaskFlow.getTaskLabelByTaskId(connection.targetId);
		var source_attributes = WF.TaskFlow.tasks_properties[connection.sourceId] && WF.TaskFlow.tasks_properties[connection.sourceId].table_attr_names ? WF.TaskFlow.tasks_properties[connection.sourceId].table_attr_names : [];
		var target_attributes = WF.TaskFlow.tasks_properties[connection.targetId] && WF.TaskFlow.tasks_properties[connection.targetId].table_attr_names ? WF.TaskFlow.tasks_properties[connection.targetId].table_attr_names : [];
		var new_source_attributes = new Array();
		if (source_attributes) $.each(source_attributes, function(i, source_attribute) {
			new_source_attributes.push(source_attribute);
		});
		var new_target_attributes = new Array();
		if (target_attributes) $.each(target_attributes, function(i, target_attribute) {
			new_target_attributes.push(target_attribute);
		});
		DBTableTaskPropertyObj.selected_connection_properties_data = {
			source_table: source_table ? source_table : "",
			source_attributes: new_source_attributes,
			target_table: target_table ? target_table : "",
			target_attributes: new_target_attributes,
			relationship: relationship
		};
	},
	onLoadConnectionProperties: function(properties_html_elm, connection, connection_property_values) {
		DBTableTaskPropertyObj.initSelectedConnectionPropertiesData(connection);
		properties_html_elm.find('.db_table_connection_html').hide();
		var WF = myWFObj.getTaskFlowChart();
		var overlays = WF.TaskFlow.available_connection_overlays_type;
		if (overlays) {
			properties_html_elm.find('.db_table_connection_html .table_attrs').html("");
			properties_html_elm.find('.db_table_connection_html').show();
			var properties_data = DBTableTaskPropertyObj.selected_connection_properties_data;
			var options = '';
			for (var i = 0; i < overlays.length; i++) {
				options += '<option>' + overlays[i] + '</option>';
			}
			properties_html_elm.find('.db_table_connection_html .relationship_props .relationship select').html(options);
			properties_html_elm.find('.db_table_connection_html .relationship_props .relationship select').val(properties_data.relationship);
			properties_html_elm.find('.db_table_connection_html .relationship_props .source').html(properties_data.source_table);
			properties_html_elm.find('.db_table_connection_html .relationship_props .target').html(properties_data.target_table);
			properties_html_elm.find('.db_table_connection_html th.source_column').html(properties_data.source_table);
			properties_html_elm.find('.db_table_connection_html th.target_column').html(properties_data.target_table);
			var html;
			if (!connection_property_values || !connection_property_values.source_columns || connection_property_values.source_columns.length == 0) {
				html = DBTableTaskPropertyObj.getTableForeignKeyHtml();
			} else {
				if (!$.isArray(connection_property_values.source_columns) && !$.isPlainObject(connection_property_values.source_columns)) {
					connection_property_values.source_columns = [connection_property_values.source_columns];
					connection_property_values.target_columns = [connection_property_values.target_columns];
				}
				html = "";
				$.each(connection_property_values.source_columns, function(i, connection_property_value) {
					var data = {
						source_column: connection_property_values.source_columns[i],
						target_column: connection_property_values.target_columns[i]
					};
					html += DBTableTaskPropertyObj.getTableForeignKeyHtml(data);
				});
			}
			if (!html) {
				WF.StatusMessage.showError("Error: Couldn't detect this connection's properties. Please remove this connection, create a new one and try again...");
			} else {
				properties_html_elm.find(".db_table_connection_html .table_attrs").html(html);
			}
		}
	},
	onSubmitConnectionProperties: function(properties_html_elm, connection, connection_property_values) {
		var WF = myWFObj.getTaskFlowChart();
		var properties_data = DBTableTaskPropertyObj.selected_connection_properties_data;
		var is_inner_connection = properties_data && properties_data.source_table && properties_data.source_table == properties_data.target_table;
		var overlay = properties_html_elm.find('.db_table_connection_html .relationship_props .relationship select').val();
		var source_columns = properties_html_elm.find(".db_table_connection_html .source_column .connection_property_field");
		var target_columns = properties_html_elm.find(".db_table_connection_html .target_column .connection_property_field");
		var status = true;
		var error_message = "";
		for (var i = 0; i < source_columns.length; i++) {
			var source_column = $(source_columns[i]).val();
			var target_column = $(target_columns[i]).val();
			if (!source_column) {
				status = false;
				error_message = "Error: Child attribute name cannot be empty!";
				break;
			} else if (!target_column) {
				status = false;
				error_message = "Error: Parent attribute name cannot be empty!";
				break;
			} else if (is_inner_connection && source_column == target_column) {
				status = false;
				error_message = "Error: Child and Parent attributes cannot be the same!";
				break;
			}
		}
		if (status) {
			WF.ContextMenu.setContextMenuConnectionId(connection.id);
			WF.ContextMenu.setSelectedConnectionOverlay(overlay, {
				do_not_call_hide_properties: true
			});
		} else WF.StatusMessage.showError(error_message);
		return status;
	},
	onCompleteConnectionProperties: function(properties_html_elm, connection, connection_property_values, status) {
		if (status) {
			DBTableTaskPropertyObj.selected_connection_properties_data = null;
			var new_connection = getConfiguredTaskTableConnection(connection);
			if (new_connection && connection.id != new_connection.id) {
				myWFObj.getTaskFlowChart().ContextMenu.setContextMenuConnectionId(new_connection.id);
				connection = new_connection;
			}
			DBTableTaskPropertyObj.updateShortTableForeignKeys(connection.sourceId);
			DBTableTaskPropertyObj.updateShortTableForeignKeys(connection.targetId);
		}
	},
	onCancelConnectionProperties: function(properties_html_elm, connection, connection_property_values) {
		DBTableTaskPropertyObj.selected_connection_properties_data = null;
		return true;
	},
	onTableConnectionDrop: function(conn) {
		var status = onTableConnectionDrop(conn);
		var WF = myWFObj.getTaskFlowChart();
		if (status) {
			var source_task_property_values = WF.TaskFlow.tasks_properties[conn.sourceId];
			var target_task_property_values = WF.TaskFlow.tasks_properties[conn.targetId];
			if (source_task_property_values && source_task_property_values.table_attr_names && getObjectorArraySize(source_task_property_values.table_attr_names) > 0) DBTableTaskPropertyObj.regularizeTaskPropertyValues(source_task_property_values);
			if (conn.sourceId != conn.targetId && target_task_property_values && target_task_property_values.table_attr_names && getObjectorArraySize(target_task_property_values.table_attr_names) > 0) {
				DBTableTaskPropertyObj.regularizeTaskPropertyValues(target_task_property_values);
			}
			var target_pks = {};
			if (target_task_property_values && target_task_property_values.table_attr_primary_keys && getObjectorArraySize(source_task_property_values.table_attr_primary_keys) > 0) $.each(target_task_property_values.table_attr_primary_keys, function(i, table_attr_primary_key) {
				if (checkIfValueIsTrue(table_attr_primary_key)) {
					var pk_name = target_task_property_values.table_attr_names[i];
					target_pks[pk_name] = i;
				}
			});
			if (!$.isEmptyObject(target_pks)) {
				var conn_attrs = {};
				var attrs_to_add = {};
				if (conn.sourceId == conn.targetId) {
					for (var pk_name in target_pks) {
						var exists = false;
						$.each(source_task_property_values.table_attr_names, function(i, table_attr_name) {
							if (table_attr_name == "parent_" + pk_name) {
								conn_attrs[table_attr_name] = pk_name;
								exists = true;
								return false;
							}
						});
						if (!exists) {
							conn_attrs["parent_" + pk_name] = pk_name;
							attrs_to_add["parent_" + pk_name] = pk_name;
						}
					}
				} else {
					if (source_task_property_values && source_task_property_values.table_attr_names && getObjectorArraySize(source_task_property_values.table_attr_names) > 0) {
						var target_table_name = WF.TaskFlow.getTaskLabelByTaskId(conn.targetId);
						for (var pk_name in target_pks) {
							var exists = false;
							$.each(source_task_property_values.table_attr_names, function(i, table_attr_name) {
								if (table_attr_name == target_table_name + "_" + pk_name) {
									conn_attrs[table_attr_name] = pk_name;
									exists = true;
									return false;
								}
							});
							if (!exists) $.each(source_task_property_values.table_attr_names, function(i, table_attr_name) {
								if (table_attr_name == pk_name) {
									conn_attrs[table_attr_name] = pk_name;
									exists = true;
									return false;
								}
							});
							if (!exists) {
								conn_attrs[pk_name] = pk_name;
								attrs_to_add[pk_name] = pk_name;
							}
						}
					} else
						for (var pk_name in target_pks) {
							conn_attrs[pk_name] = pk_name;
							attrs_to_add[pk_name] = pk_name;
						}
				}
				if (!$.isEmptyObject(attrs_to_add)) {
					if (!source_task_property_values) WF.TaskFlow.tasks_properties[conn.sourceId] = source_task_property_values = {};
					if (!$.isArray(source_task_property_values.table_attr_names) && !$.isPlainObject(source_task_property_values.table_attr_names))
						for (var i = 0; i < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; i++) {
							var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[i];
							source_task_property_values["table_attr_" + prop_name + "s"] = [];
						}
					var max_index = -1;
					if ($.isPlainObject(source_task_property_values.table_attr_names))
						for (var i in source_task_property_values.table_attr_names)
							if (i > max_index) max_index = i;
					max_index++;
					for (var src_attr_name in attrs_to_add) {
						var trg_attr_name = attrs_to_add[src_attr_name];
						var index = target_pks[trg_attr_name];
						for (var i = 0; i < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; i++) {
							var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[i];
							var prop_value = target_task_property_values["table_attr_" + prop_name + "s"][index];
							if (prop_name == "name") prop_value = src_attr_name;
							else if (prop_name == "primary_key" || prop_name == "auto_increment" || prop_name == "unique") prop_value = 0;
							else if (prop_name == "extra" && prop_value && ("" + prop_value).toLowerCase().indexOf("auto_increment") != -1) prop_value = ("" + prop_value).replace(/auto_increment/gi, "");
							if ($.isArray(source_task_property_values["table_attr_" + prop_name + "s"])) source_task_property_values["table_attr_" + prop_name + "s"].push(prop_value);
							else source_task_property_values["table_attr_" + prop_name + "s"][max_index] = prop_value;
						}
					}
				}
				var props = WF.TaskFlow.connections_properties[conn.connection.id];
				if (!props) WF.TaskFlow.connections_properties[conn.connection.id] = props = {};
				if (!props.source_columns) {
					props.source_columns = [];
					props.target_columns = [];
				} else if (!$.isArray(props.source_columns) && !$.isPlainObject(props.source_columns)) {
					props.source_columns = [props.source_columns];
					props.target_columns = [props.target_columns];
				}
				var max_index = -1;
				if ($.isPlainObject(props.source_columns))
					for (var i in props.source_columns)
						if (i > max_index) max_index = i;
				max_index++;
				for (var src_attr_name in conn_attrs) {
					var trg_attr_name = conn_attrs[src_attr_name];
					if ($.isArray(props.source_columns)) {
						if ($.inArray(src_attr_name, props.source_columns) == -1 || $.inArray(trg_attr_name, props.target_columns) == -1) {
							props.source_columns.push(src_attr_name);
							props.target_columns.push(trg_attr_name);
						}
					} else {
						for (var idx in props.source_columns)
							if (props.source_columns[idx] == src_attr_name && props.target_columns[idx] == trg_attr_name) {
								props.source_columns[max_index] = src_attr_name;
								props.target_columns[max_index] = trg_attr_name;
								max_index++;
								break;
							}
					}
				}
				WF.TaskFlow.changeConnectionOverlayType(conn.connection, "Many To One");
				DBTableTaskPropertyObj.prepareShortTableAttributes(conn.sourceId, source_task_property_values);
				DBTableTaskPropertyObj.updateShortTableForeignKeys(conn.sourceId);
				DBTableTaskPropertyObj.updateShortTableForeignKeys(conn.targetId);
			}
		}
		if (DBTableTaskPropertyObj.show_properties_on_connection_drop) WF.Property.showConnectionProperties(conn.connection.id);
		return status;
	},
	onSuccessConnectionDeletion: function(connection) {
		DBTableTaskPropertyObj.updateShortTableForeignKeys(connection.sourceId);
		DBTableTaskPropertyObj.updateShortTableForeignKeys(connection.targetId);
	},
	onClickTask: function(task_id, task) {
		if (DBTableTaskPropertyObj.current_short_attr_input_active) $(DBTableTaskPropertyObj.current_short_attr_input_active).trigger("blur");
		DBTableTaskPropertyObj.current_short_attr_input_active = null;
		showTaskPropertiesIfExists(task_id, task);
	},
	getTableForeignKeyHtml: function(data) {
		var properties_source_attributes = [],
			properties_target_attributes = [];
		var properties_data = DBTableTaskPropertyObj.selected_connection_properties_data;
		if (properties_data) {
			properties_source_attributes = properties_data.source_attributes ? properties_data.source_attributes : [];
			properties_target_attributes = properties_data.target_attributes ? properties_data.target_attributes : [];
		}
		if (properties_source_attributes.length > 0 && properties_target_attributes.length > 0) {
			var source_column = "",
				target_column = "";
			if (data) {
				source_column = data.source_column ? data.source_column : "";
				target_column = data.target_column ? data.target_column : "";
			}
			var html = '<tr>' + '<td class="source_column"><select class="connection_property_field" name="source_columns[]"><option></option>';
			for (var i = 0; i < properties_source_attributes.length; i++) html += '<option ' + (properties_source_attributes[i] == source_column ? "selected" : "") + '>' + properties_source_attributes[i] + '</option>';
			html += '</select></td>' + '<td class="target_column"><select class="connection_property_field" name="target_columns[]"><option></option>';
			for (var i = 0; i < properties_target_attributes.length; i++) html += '<option ' + (properties_target_attributes[i] == target_column ? "selected" : "") + '>' + properties_target_attributes[i] + '</option>';
			html += '</select></td>' + '<td class="table_attr_icons">' + '	<a class="icon move_up" onClick="DBTableTaskPropertyObj.moveUpTableForeignKey(this)">move up</a>' + '	<a class="icon move_down" onClick="DBTableTaskPropertyObj.moveDownTableForeignKey(this)">move down</a>' + '	<a class="icon delete" onClick="DBTableTaskPropertyObj.removeTableForeignKey(this)">remove</a>' + '</td>' + '</tr>';
			return html;
		}
	},
	addTableForeignKey: function() {
		var WF = myWFObj.getTaskFlowChart();
		var html = DBTableTaskPropertyObj.getTableForeignKeyHtml();
		if (!html) WF.StatusMessage.showError("Error: Couldn't detect this connection's properties. Please remove this connection, create a new one and try again...");
		else $("#" + WF.Property.selected_connection_properties_id + " .db_table_connection_html .table_attrs").append(html);
	},
	removeTableForeignKey: function(elm) {
		this.removeTableAttribute(elm);
	},
	moveUpTableForeignKey: function(elm) {
		this.moveUpTableAttribute(elm);
	},
	moveDownTableForeignKey: function(elm) {
		this.moveDownTableAttribute(elm);
	},
	checkingTaskConnectionsPropertiesFromTaskProperties: function(task_id) {
		var WF = myWFObj.getTaskFlowChart();
		var task_property_values = WF.TaskFlow.tasks_properties[task_id];
		var table_attr_names = task_property_values && task_property_values["table_attr_names"] ? task_property_values["table_attr_names"] : [];
		var connections = WF.TaskFlow.getSourceConnections(task_id);
		var source_inconsistencies = this.checkingTaskConnectionsPropertiesFromTaskPropertiesAux(connections, table_attr_names, "source");
		var connections = WF.TaskFlow.getTargetConnections(task_id);
		var target_inconsistencies = this.checkingTaskConnectionsPropertiesFromTaskPropertiesAux(connections, table_attr_names, "target");
		if (source_inconsistencies || target_inconsistencies) WF.StatusMessage.showError("The system detected some inconsistencies in some connections' properties for this table, but they were fixed and removed successfully.");
	},
	checkingTaskConnectionsPropertiesFromTaskPropertiesAux: function(connections, table_attr_names, type) {
		var inconsistencies = false;
		var WF = myWFObj.getTaskFlowChart();
		if ($.isPlainObject(table_attr_names)) {
			var arr = new Array();
			for (var i in table_attr_names) arr.push(table_attr_names[i]);
			table_attr_names = arr;
		}
		for (var i = 0; i < connections.length; i++) {
			var c = connections[i];
			var props = WF.TaskFlow.connections_properties[c.id];
			if (props) {
				if (!$.isArray(props.source_columns) && !$.isPlainObject(props.source_columns)) {
					props.source_columns = [props.source_columns];
					props.target_columns = [props.target_columns];
				}
				var new_props = {
					source_columns: [],
					target_columns: [],
				};
				$.each(props.source_columns, function(j, source_column) {
					var sc = props.source_columns[j];
					var tc = props.target_columns[j];
					var exists = (type == "source" && $.inArray(sc, table_attr_names) != -1) || (type == "target" && $.inArray(tc, table_attr_names) != -1);
					if (exists) {
						new_props["source_columns"].push(sc);
						new_props["target_columns"].push(tc);
					} else {
						inconsistencies = true;
					}
				});
				WF.TaskFlow.connections_properties[c.id] = new_props.source_columns.length > 0 ? new_props : null;
			}
		}
		return inconsistencies;
	},
	regularizeTaskPropertyValues: function(task_property_values) {
		if (!$.isArray(task_property_values.table_attr_names) && !$.isPlainObject(task_property_values.table_attr_names)) {
			for (var i = 0; i < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; i++) {
				var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[i];
				task_property_values["table_attr_" + prop_name + "s"] = [task_property_values["table_attr_" + prop_name + "s"]];
			}
		}
		$.each(task_property_values.table_attr_names, function(i, table_attr_name) {
			for (var j = 0; j < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; j++) {
				var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[j];
				if (!task_property_values.hasOwnProperty("table_attr_" + prop_name + "s") || (!$.isPlainObject(task_property_values["table_attr_" + prop_name + "s"]) && !$.isArray(task_property_values["table_attr_" + prop_name + "s"]))) task_property_values["table_attr_" + prop_name + "s"] = {};
				if (typeof task_property_values["table_attr_" + prop_name + "s"][i] == "undefined") task_property_values["table_attr_" + prop_name + "s"][i] = null;
			}
		});
	},
	toggleTableAndListView: function(elm) {
		var task_html_elm = $(elm).parent().closest('.db_table_task_html');
		if (task_html_elm.hasClass("attributes_list_shown")) this.convertListToTable(elm);
		else this.convertTableToList(elm);
	},
	convertTableToList: function(elm) {
		elm = $(elm);
		var task_html_elm = elm.parent().closest('.db_table_task_html');
		var table = task_html_elm.find("table");
		var ul = task_html_elm.find(".list_attributes > ul.list_attrs");
		var rows = table.find("tbody.table_attrs tr");
		var column_names = this.getTableColumnNames(table);
		ul.html("");
		for (var i = 0; i < rows.length; i++) this.convertTableRowToListItem(ul, $(rows[i]), column_names);
		task_html_elm.removeClass("attributes_table_shown").addClass("attributes_list_shown");
	},
	getTableColumnNames: function(table) {
		var column_names = [];
		var ths = table.find("thead tr th");
		for (var i = 0; i < ths.length; i++) {
			th = $(ths[i]);
			column_names.push(th.html());
			if (th[0].hasAttribute("colspan")) {
				var length = parseInt(th.attr("colspan"));
				if ($.isNumeric(length) && length > 0)
					for (var j = 0; j < length - 1; j++) column_names.push(th.html());
			}
		}
		return column_names;
	},
	convertTableRowToListItem: function(ul, row, column_names) {
		var columns = row.children("td");
		var li = document.createElement("LI");
		li = $(li);
		li.attr("class", row.attr("class"));
		ul.append(li);
		for (var i = 0; i < columns.length; i++) {
			column = $(columns[i]);
			var column_name = column_names[i];
			var div = document.createElement("DIV");
			div = $(div);
			div.attr("class", column.attr("class"));
			div.attr("style", column.attr("style"));
			if (!column.hasClass("table_attr_icons")) div.append('<label>' + column_name + ':</label>');
			div.append(column.children());
			li.append(div);
		}
	},
	convertListToTable: function(elm) {
		elm = $(elm);
		var task_html_elm = elm.parent().closest('.db_table_task_html');
		var tbody = task_html_elm.find("table tbody.table_attrs");
		var lis = task_html_elm.find(".list_attributes > ul.list_attrs > li");
		tbody.html("");
		for (var i = 0; i < lis.length; i++) {
			li = $(lis[i]);
			var columns = li.children("div");
			var tr = document.createElement("TR");
			tr = $(tr);
			tr.attr("class", li.attr("class"));
			tbody.append(tr);
			for (var j = 0; j < columns.length; j++) {
				column = $(columns[j]);
				var td = document.createElement("TD");
				td = $(td);
				td.attr("class", column.attr("class"));
				td.attr("style", column.attr("style"));
				if (!column.hasClass("table_attr_icons")) column.children("label").first().remove();
				td.append(column.children());
				tr.append(td);
			}
		}
		task_html_elm.removeClass("attributes_list_shown").addClass("attributes_table_shown");
	},
	getTaskTableAttributesData: function(task_id, fks) {
		var WF = myWFObj.getTaskFlowChart();
		var task_property_values = WF.TaskFlow.tasks_properties[task_id];
		if (task_property_values && task_property_values.table_attr_names) {
			var data = {};
			$.each(task_property_values.table_attr_names, function(i, table_attr_name) {
				var attribute_data = {};
				for (var j = 0; j < DBTableTaskPropertyObj.task_property_values_table_attr_prop_names.length; j++) {
					var prop_name = DBTableTaskPropertyObj.task_property_values_table_attr_prop_names[j];
					attribute_data[prop_name] = task_property_values["table_attr_" + prop_name + "s"][i];
				}
				attribute_data = DBTableTaskPropertyObj.prepareTaskTableAttributeData(attribute_data, fks);
				data[table_attr_name] = attribute_data;
			});
			return data;
		}
		return null;
	},
	getTaskTableAttributeData: function(task_id, attribute_name, fks) {
		var data = this.getTaskTableAttributesData(task_id, fks);
		return data[attribute_name];
	},
	prepareTaskTableAttributeData: function(attribute_data, fks) {
		attribute_data["primary_key"] = checkIfValueIsTrue(attribute_data["primary_key"]);
		attribute_data["null"] = checkIfValueIsTrue(attribute_data["null"]);
		attribute_data["unsigned"] = checkIfValueIsTrue(attribute_data["unsigned"]);
		attribute_data["unique"] = checkIfValueIsTrue(attribute_data["unique"]);
		attribute_data["auto_increment"] = checkIfValueIsTrue(attribute_data["auto_increment"]);
		attribute_data["has_default"] = checkIfValueIsTrue(attribute_data["has_default"]);
		if (attribute_data["default"]) attribute_data["has_default"] = true;
		if (typeof attribute_data["extra"] == "string" && attribute_data["extra"].toLowerCase().indexOf("auto_increment") != -1) attribute_data["auto_increment"] = true;
		attribute_data["original_type"] = attribute_data["type"];
		attribute_data["key_type"] = this.getShortTableAttributeKeyType(attribute_data, fks);
		var current_simple_props = assignObjectRecursively({}, attribute_data);
		var simple_type = this.isSimpleAttribute(current_simple_props);
		if (simple_type) {
			var simple_props = this.column_simple_types[simple_type];
			attribute_data["type"] = simple_type;
			if (!attribute_data["auto_increment"] && simple_props.hasOwnProperty("extra") && typeof simple_props["extra"] == "string" && simple_props["extra"].toLowerCase().indexOf("auto_increment") != -1) attribute_data["auto_increment"] = true;
			else if (simple_props.hasOwnProperty("auto_increment")) attribute_data["auto_increment"] = simple_props["auto_increment"];
		}
		return attribute_data;
	},
	prepareTaskPropertyValuesWithDefaultAttributes: function(task_property_values, table_name) {
		var id_attribute_name = (table_name ? table_name.toLowerCase().replace(/ /g, "_").replace(/_+/g, "_") + "_" : "") + "id";
		id_attribute_name = normalizeTaskTableName(id_attribute_name);
		if (!$.isPlainObject(task_property_values)) task_property_values = {};
		task_property_values.table_attr_names = [id_attribute_name, "created_date", "created_user_id", "modified_date", "modified_user_id"];
		task_property_values.table_attr_primary_keys = [true, null, null, null, null];
		task_property_values.table_attr_types = ["bigint", "timestamp", "bigint", "timestamp", "bigint"];
		task_property_values.table_attr_lengths = [20, null, 20, null, 20];
		task_property_values.table_attr_nulls = [false, true, true, true, true];
		task_property_values.table_attr_unsigneds = [true, false, true, false, true];
		task_property_values.table_attr_uniques = [true, false, false, false, false];
		task_property_values.table_attr_auto_increments = [true, false, false, false, false];
		task_property_values.table_attr_has_defaults = [false, true, false, true, false];
		task_property_values.table_attr_defaults = [null, "0000-00-00 00:00:00", null, "0000-00-00 00:00:00", null];
		task_property_values.table_attr_extras = [null, null, null, null, null];
		task_property_values.table_attr_charsets = [null, null, null, null, null];
		task_property_values.table_attr_collations = [null, null, null, null, null];
		task_property_values.table_attr_comments = [null, null, null, null, null];
		return task_property_values;
	},
};
