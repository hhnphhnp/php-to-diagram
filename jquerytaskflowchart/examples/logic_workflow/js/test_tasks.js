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

function isLabelValid(label_obj, ignore_msg) {
	if (!label_obj.label || label_obj.label == "") {
		var msg = "Invalid label. Please choose a different label.\nOnly this characters are allowed: a-z, A-Z, 0-9, '-', '_', '.', ' ', '$' and you must have at least 1 character.";
		if (label_obj.from_prompt) alert(msg);
		else taskFlowChartObj.StatusMessage.showError(msg);
	}
	return true;
}

function isTaskLabelValid(label_obj, task_id, ignore_msg) {
	if (!isLabelValid(label_obj, ignore_msg)) return false;
	return isTaskLabelRepeated(label_obj, task_id, ignore_msg) == false;
}

function isTaskLabelRepeated(label_obj, task_id, ignore_msg) {
	
	var l = label_obj.label.toLowerCase();
	var tasks = taskFlowChartObj.TaskFlow.getAllTasks();
	var total = tasks.length;
	for (var i = 0; i < total; i++) {
		var t = $(tasks[i]);
		var elm_label = taskFlowChartObj.TaskFlow.getTaskLabel(t);
		if (l == elm_label.toLowerCase() && t.attr("id") != task_id) {
			if (!ignore_msg) {
				var msg = "Error: Repeated label.\nYou cannot have repeated labels!\nPlease try again...";
				taskFlowChartObj.StatusMessage.showError(msg);
				var msg_elm = taskFlowChartObj.StatusMessage.getMessageHtmlObj().children(".error").last();
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
	
	var tasks = taskFlowChartObj.TaskFlow.getAllTasks();
	var total = tasks.length;
	var task_label = taskFlowChartObj.TaskFlow.getTaskLabelByTaskId(task_id);
	for (var i = 0; i < total; i++) {
		var t = $(tasks[i]);
		var elm_label = taskFlowChartObj.TaskFlow.getTaskLabel(t);
		if (task_label == elm_label && t.attr("id") != task_id) {
			var r = parseInt(Math.random() * 10000);
			var new_label = task_label + "_" + r;
			taskFlowChartObj.TaskFlow.getTaskLabelElementByTaskId(task_id).html(new_label);
			taskFlowChartObj.TaskFlow.centerTaskInnerElements(task_id);
			break;
		}
	}
	return true;
}

function isTaskConnectionToItSelf(conn) {
	return conn.sourceId == conn.targetId;
}

function invalidateTaskConnectionIfItIsToItSelf(conn) {
	if (isTaskConnectionToItSelf(conn)) {
		taskFlowChartObj.StatusMessage.showError("WARNING: Sorry but you cannot create a connection to a task it-self!");
		return false;
	}
	return true;
}

function onlyAllowOneConnectionPerExitAndNotToItSelf(conn) {
	if (invalidateTaskConnectionIfItIsToItSelf(conn)) {
		var source_id = conn.sourceId;
		var connection_exit_id = conn.connection.getParameter("connection_exit_id");
		if (connection_exit_id) {
			var connections = taskFlowChartObj.TaskFlow.getSourceConnections(source_id);
			for (var i = 0; i < connections.length; i++) {
				var c = connections[i];
				var ceid = c.getParameter("connection_exit_id");
				if (ceid && c.id != conn.connection.id && ceid == connection_exit_id) {
					taskFlowChartObj.StatusMessage.showError("You can only have 1 connection from the each exit point.");
					return false
				}
			}
		}
		return true;
	}
	return false;
}

function onTaskCloning(task_id, opts) {
	
	taskFlowChartObj.TaskFlow.setTaskLabelByTaskId(task_id, {
		label: null
	});
	if (!opts || !opts["do_not_show_task_properties"]) taskFlowChartObj.Property.showTaskProperties(task_id);
}

function checkIfValueIsTrue(value) {
	var v = typeof value == "string" ? value.toLowerCase() : "";
	return (value && value != null && value != 0 && value !== false && v != "null" && v != "false" && v != "0");
}

function onEditLabel(task_id) {
	var task = taskFlowChartObj.TaskFlow.getTaskById(task_id);
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
	
	var task = taskFlowChartObj.TaskFlow.getTaskById(task_id);
	var task_type = task.attr("type");
	var show_task_properties = taskFlowChartObj.Property.isTaskSubSettingTrue(task_type, "task_menu", "show_properties_menu", true);
	if (show_task_properties) {
		var selected_task_properties = $("#" + taskFlowChartObj.Property.selected_task_properties_id);
		if (selected_task_properties.is(":visible") && selected_task_properties.attr("task_id") == task_id) selected_task_properties.find(task_properties_input_selector).val(taskFlowChartObj.TaskFlow.getTaskLabel(task));
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
	
	var task_type = task.attr("type");
	var show_task_properties = taskFlowChartObj.Property.isTaskSubSettingTrue(task_type, "task_menu", "show_properties_menu", true);
	if (show_task_properties) {
		taskFlowChartObj.Property.showTaskProperties(task_id, {
			do_not_call_hide_properties: true
		});
		if (taskFlowChartObj.Property.isSelectedTaskPropertiesOpen()) taskFlowChartObj.ContextMenu.hideContextMenus();
	}
}

function showConnectionPropertiesIfExists(connection) {
	if (connection) {
		
		var task_type = $("#" + connection.sourceId).attr("type");
		var show_connection_properties = taskFlowChartObj.Property.isTaskSubSettingTrue(task_type, "connection_menu", "show_properties_menu", true);
		if (show_connection_properties) {
			taskFlowChartObj.Property.showConnectionProperties(connection.id, {
				do_not_call_hide_properties: true
			});
			if (taskFlowChartObj.Property.isSelectedConnectionPropertiesOpen()) taskFlowChartObj.ContextMenu.hideContextMenus();
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

var ProgrammingTaskUtil = {
	on_programming_task_properties_new_html_callback: null,
	connections_to_add_after_deletion: null,
	
	onTaskCreation: function(task_id) {
		
		var task = taskFlowChartObj.TaskFlow.getTaskById(task_id);
		task.addClass("logic_task");
	},
	onTaskCloning: function(task_id) {
		onTaskCloning(task_id);
		
		taskFlowChartObj.TaskFlow.setTaskLabelByTaskId(task_id, {
			label: "Add your label"
		});
	},
	onConnectionDrag: function(conn) {
		if (onlyAllowOneConnectionPerExitAndNotToItSelf(conn)) {
			var end_point_elm = conn.sourceEndpoint.element[0];
			var connection_label = $(end_point_elm).children("span").text();
			connection_label = connection_label ? connection_label : end_point_elm.getAttribute("connection_exit_id");
			conn.connection.getOverlay("label").setLabel(connection_label);
			return true;
		}
		return false;
	},
	onConnectionDragForFinalTasks: function(conn) {
		if (confirm("This is a final task!\nIf you proceed and connect this task with others, this connection will be ignored in the code generation.\nPlease only use this for diagram usuability purposes.\n\nDo you wish to proceed?")) return onlyAllowOneConnectionPerExitAndNotToItSelf(conn);
		return false;
	},
	onConnectionDrop: function(conn) {
		if (conn.target.attr("is_start_task")) {
			
			conn.source.attr("is_start_task", 1);
			conn.source.addClass(taskFlowChartObj.TaskFlow.start_task_class_name);
			conn.target.removeAttr("is_start_task");
			conn.target.removeClass(taskFlowChartObj.TaskFlow.start_task_class_name);
		}
		return true;
	},
	addCodeMenuOnShowTaskMenu: function(task_id, j_task, task_context_menu) {
		var show_code_menu = task_context_menu.children(".show_code");
		if (!show_code_menu[0]) {
			var li = $('<li class="show_code"><a href="#">Show Code</a></li>');
			li.click(function(originalEvent) {
				var selected_task_id = taskFlowChartObj.ContextMenu.getContextMenuTaskId();
				var selected_task = taskFlowChartObj.TaskFlow.getTaskById(selected_task_id);
				var show_code_timeout_id = selected_task.data("show_code_timeout_id");
				if (show_code_timeout_id) clearTimeout(show_code_timeout_id);
				selected_task.addClass("show_code");
				show_code_timeout_id = setTimeout(function() {
					selected_task.removeClass("show_code");
				}, 5000);
				selected_task.data("show_code_timeout_id", show_code_timeout_id);
				
				var task_tag = selected_task.attr("tag");
				var obj = task_tag == "if" ? IfTaskPropertyObj : SwitchTaskPropertyObj;
				var task_property_values = taskFlowChartObj.TaskFlow.tasks_properties[selected_task_id];
				var code = obj.getCode(task_property_values);
				taskFlowChartObj.StatusMessage.showMessage(code);
			});
			task_context_menu.children(".delete").before(li);
		}
	},
	removeCodeMenuOnShowTaskMenu: function(task_id, j_task, task_context_menu) {
		task_context_menu.children(".show_code").remove();
	},
	onSuccessTaskBetweenConnection: function(task_id) {
		
		var task = taskFlowChartObj.TaskFlow.getTaskById(task_id);
		var extra_top = taskFlowChartObj.TaskSort.task_margins_top_and_bottom_average * 2;
		var parent_connections = taskFlowChartObj.TaskFlow.getTargetConnections(task_id);
		var child_connections = taskFlowChartObj.TaskFlow.getSourceConnections(task_id);
		var pl = parent_connections.length;
		var cl = child_connections.length;
		var parent_id = null;
		var child_id = null;
		for (var i = 0; i < pl; i++) {
			parent_id = parent_connections[i].sourceId;
			if (parent_id) break;
		}
		for (var i = 0; i < cl; i++) {
			child_id = child_connections[i].targetId;
			if (child_id) break;
		}
		if (child_id) {
			var parent_task = taskFlowChartObj.TaskFlow.getTaskById(parent_id);
			var child_task = taskFlowChartObj.TaskFlow.getTaskById(child_id);
			var parent_top = parseInt(parent_task.css("top"));
			var child_top = parseInt(child_task.css("top"));
			var push_tasks_down = true;
			if (parent_id) {
				var task_top = parseInt(task.css("top"));
				push_tasks_down = parent_top + parent_task.height() + extra_top + task.height() + extra_top > child_top;
			}
			task.css("left", child_task.css("left"));
			if (push_tasks_down) {
				var new_top = parent_top + parent_task.height() + extra_top;
				task.css("top", new_top + "px");
				var push_down_ignore_tasks_id = [parent_id, task_id];
				for (var i = 0; i < cl; i++) {
					var child_id = child_connections[i].targetId;
					var child_task = taskFlowChartObj.TaskFlow.getTaskById(child_id);
					var child_top = parseInt(child_task.css("top"));
					if (child_top > parent_top + parent_task.height()) {
						var diff = child_top - (parent_top + parent_task.height()) + task.height();
						ProgrammingTaskUtil.pushDownFollowingTask(child_id, diff, push_down_ignore_tasks_id);
					}
				}
			}
			taskFlowChartObj.TaskFlow.repaintAllTasks();
		}
	},
	pushDownFollowingTask: function(task_id, extra_top, ignore_tasks_id) {
		ignore_tasks_id = $.isArray(ignore_tasks_id) ? ignore_tasks_id : [];
		if (ignore_tasks_id.indexOf(task_id) == -1) {
			ignore_tasks_id.push(task_id);
			
			var task = taskFlowChartObj.TaskFlow.getTaskById(task_id);
			var top = parseInt(task.css("top")) + extra_top;
			task.css("top", top + "px");
			var child_connections = taskFlowChartObj.TaskFlow.getSourceConnections(task_id);
			var cl = child_connections.length;
			for (var i = 0; i < cl; i++) ProgrammingTaskUtil.pushDownFollowingTask(child_connections[i].targetId, extra_top, ignore_tasks_id);
		}
	},
	createTaskLabelField: function(properties_html_elm, task_id) {
		var label = taskFlowChartObj.TaskFlow.getTaskLabelByTaskId(task_id);
		label = label ? label.replace(/"/g, "&quot;") : "";
		properties_html_elm.find(".properties_task_id").html('<input type="text" value="' + label + '" old_value="' + label + '" />');
	},
	onEditLabel: function(task_id) {
		onEditLabel(task_id);
		updateTaskLabelInShownTaskProperties(task_id, ".properties_task_id input");
		taskFlowChartObj.TaskFlow.repaintTaskByTaskId(task_id);
		return true;
	},
	saveTaskLabelField: function(properties_html_elm, task_id) {
		var old_label = properties_html_elm.find(".properties_task_id input").attr("old_value");
		var new_label = properties_html_elm.find(".properties_task_id input").val();
		if (new_label && old_label != new_label) {
			taskFlowChartObj.TaskFlow.getTaskLabelElementByTaskId(task_id).html(new_label);
			onEditLabel(task_id);
		}
	},
	updateTaskDefaultExitLabel: function(task_id, label) {
		var labels = {
			"default_exit": label
		};
		this.updateTaskExitsLabels(task_id, labels);
	},
	updateTaskExitsLabels: function(task_id, labels) {
		
		var task = taskFlowChartObj.TaskFlow.getTaskById(task_id);
		var exits = task.find(" > ." + taskFlowChartObj.TaskFlow.task_eps_class_name + " ." + taskFlowChartObj.TaskFlow.task_ep_class_name);
		var exit, connection_exit_id, span, bg, title;
		for (var i = 0; i < exits.length; i++) {
			exit = $(exits[i]);
			connection_exit_id = exit.attr("connection_exit_id");
			if (connection_exit_id && labels.hasOwnProperty(connection_exit_id)) {
				if (labels[connection_exit_id]) {
					span = $('<span>' + labels[connection_exit_id].replace(/</g, "&lt;") + '</span>');
					bg = exit.css("background-color");
					if (bg) {
						if (bg.indexOf("rgb") != -1) bg = colorRgbToHex(bg);
						span.css("color", bg && getContrastYIQ(bg) == "white" ? "#FFF" : "#000");
					}
					title = labels[connection_exit_id];
					exit.html(span);
					exit.attr("title", title);
				} else {
					exit.html("");
					exit.attr("title", "");
				}
			}
		}
		var height = 28 + (exits.length * 25);
		var is_resizable_task = task.attr("is_resizable_task");
		var resize_height = is_resizable_task ? height > task.height() : height != task.height();
		if (resize_height) {
			task.css("height", height + "px");
			taskFlowChartObj.TaskFlow.repaintTask(task);
		}
	},
	updateTaskExitsConnectionExitLabelAttribute: function(task_id, labels) {
		
		var task = taskFlowChartObj.TaskFlow.getTaskById(task_id);
		var exits = task.find(" > ." + taskFlowChartObj.TaskFlow.task_eps_class_name + " ." + taskFlowChartObj.TaskFlow.task_ep_class_name);
		var exit, connection_exit_id;
		for (var i = 0; i < exits.length; i++) {
			exit = $(exits[i]);
			connection_exit_id = exit.attr("connection_exit_id");
			if (connection_exit_id && labels.hasOwnProperty(connection_exit_id)) {
				if (labels[connection_exit_id]) exit.attr("connection_exit_label", labels[connection_exit_id]).attr("title", labels[connection_exit_id]);
				else exit.attr("connection_exit_label", "").attr("title", "");
			}
		}
	},
	updateTaskExitsConnectionsLabels: function(task_id, labels) {
		
		var child_connections = taskFlowChartObj.TaskFlow.getSourceConnections(task_id);
		var cl = child_connections.length;
		for (var i = 0; i < cl; i++) {
			var child_connection = child_connections[i];
			var parameters = child_connection.getParameters();
			var exit_id = parameters["connection_exit_id"];
			if (exit_id && labels.hasOwnProperty(exit_id)) child_connection.getOverlay("label").setLabel(labels[exit_id]);
		}
	},
	onBeforeTaskDeletion: function(task_id, task) {
		this.connections_to_add_after_deletion = [];
		this.new_start_task_id = null;
		this.new_start_task_order = null;
		
		var child_connections = taskFlowChartObj.TaskFlow.getSourceConnections(task_id);
		var cl = child_connections.length;
		var target_id = cl > 0 && child_connections[0] ? child_connections[0].targetId : null;
		if (target_id) {
			var start_task_order = task.attr("is_start_task");
			if (start_task_order > 0) {
				this.new_start_task_id = target_id;
				this.new_start_task_order = start_task_order;
			}
			var parent_connections = taskFlowChartObj.TaskFlow.getTargetConnections(task_id);
			var pl = parent_connections.length;
			if (pl > 0)
				for (var i = 0; i < pl; i++) {
					var parent_connection = parent_connections[i];
					var source_id = parent_connection.sourceId;
					if (source_id) {
						var parameters = parent_connection.getParameters();
						var connector_type = parameters.connection_exit_type;
						var connection_overlay = parameters.connection_exit_overlay;
						var connection_label = parent_connection.getOverlay("label").getLabel();
						var connection_color = parameters.connection_exit_color;
						if (!connection_color) {
							connection_color = parent_connection.endpoints[0].element[0].getAttribute("connection_exit_color");
							connection_color = connection_color ? connection_color : parent_connection.getPaintStyle().strokeStyle;
						}
						var connection_exit_props = {
							id: parameters.connection_exit_id,
							color: connection_color
						};
						this.connections_to_add_after_deletion.push([source_id, target_id, connection_label, connector_type, connection_overlay, connection_exit_props]);
					}
				}
		}
		return true;
	},
	onAfterTaskDeletion: function(task_id, task) {
		
		if (this.new_start_task_id) {
			var new_task = taskFlowChartObj.TaskFlow.getTaskById(this.new_start_task_id);
			new_task.attr("is_start_task", this.new_start_task_order).addClass("is_start_task");
		}
		if ($.isArray(this.connections_to_add_after_deletion) && this.connections_to_add_after_deletion.length > 0) {
			for (var i = 0; i < this.connections_to_add_after_deletion.length; i++) {
				var c = this.connections_to_add_after_deletion[i];
				var source_task_id = c[0];
				var target_task_id = c[1];
				var connection_label = c[2];
				var connector_type = c[3];
				var connection_overlay = c[4];
				var connection_exit_props = c[5];
				taskFlowChartObj.TaskFlow.connect(source_task_id, target_task_id, connection_label, connector_type, connection_overlay, connection_exit_props);
			}
		}
		return true;
	},
	onProgrammingTaskPropertiesNewHtml: function(elm) {
		if (typeof ProgrammingTaskUtil.on_programming_task_properties_new_html_callback == "function") {
			ProgrammingTaskUtil.on_programming_task_properties_new_html_callback(elm);
		}
	},
};
	
var IfTaskPropertyObj = {
	onLoadTaskProperties: function(properties_html_elm, task_id, task_property_values) {
		ProgrammingTaskUtil.createTaskLabelField(properties_html_elm, task_id);
		
		if (!task_property_values) {
			task_property_values = {};
		}
		
		console.log(task_property_values);
	},
	onSubmitTaskProperties: function(properties_html_elm, task_id, task_property_values) {
		ProgrammingTaskUtil.saveTaskLabelField(properties_html_elm, task_id);
		return true;
	},
	onCompleteTaskProperties: function(properties_html_elm, task_id, task_property_values, status) {
		if (status) {
			var labels = IfTaskPropertyObj.getExitLabels(task_property_values);
			ProgrammingTaskUtil.updateTaskExitsLabels(task_id, labels);
		}
	},
	onCancelTaskProperties: function(properties_html_elm, task_id, task_property_values) {
		return true;
	},
	onCompleteLabel: function(task_id) {
		return ProgrammingTaskUtil.onEditLabel(task_id);
	},
	onTaskCreation: function(task_id) {
		setTimeout(function() {
			var task_property_values = taskFlowChartObj.TaskFlow.tasks_properties[task_id];
			var labels = IfTaskPropertyObj.getExitLabels(task_property_values);
			ProgrammingTaskUtil.updateTaskExitsLabels(task_id, labels);
			onEditLabel(task_id);
			ProgrammingTaskUtil.onTaskCreation(task_id);
		}, 100);
	},
	getExitLabels: function(task_property_values) {
		var labels = {
			"true": "True",
			"false": "False"
		};
		if (task_property_values && task_property_values["exits"]) {
			var exits = task_property_values["exits"];
			labels["true"] = exits["true"] && exits["true"]["label"] ? exits["true"]["label"] : labels["true"];
			labels["false"] = exits["false"] && exits["false"]["label"] ? exits["false"]["label"] : labels["false"];
		}
		return labels;
	},
	
	getCode: function(task_property_values) {
		return "some if code...";
	}
};

var SwitchTaskPropertyObj = {
	properties_html_elm: null,
	previous_task_property_values: null,
	available_default_colors: ["#46F4A0", "#99F2FA", "#33ADB7", "#AAAAFD", "#FF83B4", "#FF9B6F", "#F2EC22", "#B9BF15", "#7B800E", "#00727C", "#29B473", "#00DEF2", "#7171FB", "#BF4B79", "#FF590F", "#124DB5", "#99D6DB", "#A3FAD0", "#FFC1DA", "#FCFFA4"],
	
	onLoadTaskProperties: function(properties_html_elm, task_id, task_property_values) {
		ProgrammingTaskUtil.createTaskLabelField(properties_html_elm, task_id);
		SwitchTaskPropertyObj.properties_html_elm = properties_html_elm;
		var html = '';
		if (!task_property_values) {
			task_property_values = {};
		}
		if (!task_property_values.cases) {
			task_property_values.cases = {};
		}
		if (!task_property_values.cases.hasOwnProperty('case') || !task_property_values.cases['case']) {
			task_property_values.cases['case'] = [{
				'value': '',
				exit: 'exit_1'
			}];
		}
		if (!task_property_values.hasOwnProperty('default') || !task_property_values['default']) {
			task_property_values['default'] = {};
		}
		if (!task_property_values['default'].hasOwnProperty('exit') || !task_property_values['default'].exit) {
			task_property_values['default'].exit = 'default_exit';
		}
		
		if (task_property_values.cases['case']) {
			var c = task_property_values.cases['case'];
			var idx = 0;
			if (c.hasOwnProperty('value')) {
				html += SwitchTaskPropertyObj.getCaseHtml(task_property_values, c, idx, "#426efa");
			} else {
				for (var i in c) {
					html += SwitchTaskPropertyObj.getCaseHtml(task_property_values, c[i], idx, idx == 0 ? "#426efa" : "");
					idx++;
				}
			}
		}
		var cases_ul = $(properties_html_elm).find('.switch_task_html .cases ul').first();
		cases_ul.html(html);
		cases_ul.attr('cases_counter', idx + 1);
		ProgrammingTaskUtil.onProgrammingTaskPropertiesNewHtml(cases_ul.children("li"));
		
		var default_color = "#000";
		$(properties_html_elm).find('.switch_task_html .default_property_exit').css({
			backgroundColor: default_color
		});
		
		$(properties_html_elm).find('.switch_task_html .default_property_exit').attr('value', task_property_values['default'].exit);
		$(properties_html_elm).find('.switch_task_html .default_exit').attr('exit_id', task_property_values['default'].exit);
		$(properties_html_elm).find('.switch_task_html .default_exit').attr('exit_color', default_color);
	},
	getCaseHtml: function(task_property_values, case_item, idx, case_color) {
		var case_color = case_color ? case_color : this.getExitColor(task_property_values, case_item.exit);
		var case_value = case_item.value ? case_item.value.replace(/"/g, "&quot;") : "";
		return '<li>' + '<input type=\"text\" class=\"task_property_field\" property_name=\"cases[case][' + idx + '][value]\" value=\"' + case_value + '\" />' + '<div class=\"task_property_field case_property_exit\" property_name=\"cases[case][' + idx + '][exit]\" value=\"' + case_item.exit + '\" style=\"background-color:' + case_color + '\"></div>' + '<div class=\"task_property_exit case_exit\" exit_id=\"' + case_item.exit + '\" exit_color=\"' + case_color + '\"></div>' + '<a class="icon remove" onClick=\"SwitchTaskPropertyObj.removeCase(this)\">remove</a>' + '</li>';
	},
	getExitColor: function(task_property_values, exit_id) {
		if (!exit_id) {
			alert('Error in SwitchTaskPropertyObj->getExitColor: exit_id is undefined.');
		}
		if (task_property_values && task_property_values.exits) {
			var exit = task_property_values.exits[exit_id];
			if (exit && exit.color) {
				return exit.color;
			}
		}
		if (this.properties_html_elm) {
			var items = $(this.properties_html_elm).find('.switch_task_html .task_property_exit');
			var total = items.length;
			var new_exit_color;
			var status;
			var idx = 0;
			do {
				new_exit_color = this.available_default_colors && this.available_default_colors.length > idx ? this.available_default_colors[idx] : nextColor();
				status = new_exit_color != "rgb(0,0,0)";
				for (var i = 0; status && i < total; i++) {
					if ($(items[i]).attr('exit_color') == new_exit_color) {
						status = false;
						break;
					}
				}
				idx++;
			} while (!status);
			return new_exit_color;
		}
		return randomColor();
	},
	getNewExitId: function() {
		var items = $(this.properties_html_elm).find('.switch_task_html .task_property_exit');
		var total = items.length;
		var new_exit_id;
		var status;
		do {
			new_exit_id = 'exit_' + parseInt(Math.random() * 10000);
			status = true;
			for (var i = 0; i < total; i++) {
				if ($(items[i]).attr('exit_id') == new_exit_id) {
					status = false;
				}
			}
		} while (!status);
		return new_exit_id;
	},
	addCase: function(a) {
		var main_ul = $(this.properties_html_elm).find('.switch_task_html .cases ul').first();
		var cases_counter = parseInt($(main_ul).attr('cases_counter'));
		$(main_ul).attr('cases_counter', cases_counter + 1);
		var exit_id = this.getNewExitId();
		var case_item = {
			'value': '',
			'exit': exit_id
		};
		var html = this.getCaseHtml(null, case_item, cases_counter);
		main_ul.append(html);
		ProgrammingTaskUtil.onProgrammingTaskPropertiesNewHtml(main_ul.children("li").last());
	},
	removeCase: function(a) {
		$(a).parent().remove();
	},
	onSubmitTaskProperties: function(properties_html_elm, task_id, task_property_values) {
		SwitchTaskPropertyObj.previous_task_property_values = taskFlowChartObj.TaskFlow.tasks_properties[task_id];
		ProgrammingTaskUtil.saveTaskLabelField(properties_html_elm, task_id);
		return true;
	},
	onCompleteTaskProperties: function(properties_html_elm, task_id, task_property_values, status) {
		if (status) {
			var labels = SwitchTaskPropertyObj.getExitLabels(task_property_values);
			ProgrammingTaskUtil.updateTaskExitsLabels(task_id, labels);
			if (labels) {
				var previous_task_property_values = SwitchTaskPropertyObj.previous_task_property_values;
				var prev_cases = previous_task_property_values["cases"] && previous_task_property_values["cases"]["case"] ? previous_task_property_values["cases"]["case"] : null;
				if (prev_cases) {
					if (prev_cases["exit"]) prev_cases = [prev_cases];
					var labels_to_update = {};
					for (var i in prev_cases) {
						var c = prev_cases[i];
						var exit_id = c["exit"];
						if (exit_id && exit_id != "default_exit") {
							var prev_exit_value = typeof c["value"] != "undefined" || typeof c["value"] != null ? c["value"] : "";
							if (labels.hasOwnProperty(exit_id) && labels[exit_id] != prev_exit_value) labels_to_update[exit_id] = labels[exit_id];
						}
					}
					ProgrammingTaskUtil.updateTaskExitsConnectionExitLabelAttribute(task_id, labels_to_update);
					ProgrammingTaskUtil.updateTaskExitsConnectionsLabels(task_id, labels_to_update);
				}
			}
		}
	},
	onCancelTaskProperties: function(properties_html_elm, task_id, task_property_values) {
		return true;
	},
	onCompleteLabel: function(task_id) {
		return ProgrammingTaskUtil.onEditLabel(task_id);
	},
	onTaskCreation: function(task_id) {
		setTimeout(function() {
			var task_property_values = taskFlowChartObj.TaskFlow.tasks_properties[task_id];
			var labels = SwitchTaskPropertyObj.getExitLabels(task_property_values);
			ProgrammingTaskUtil.updateTaskExitsLabels(task_id, labels);
			ProgrammingTaskUtil.updateTaskExitsConnectionExitLabelAttribute(task_id, labels);
			onEditLabel(task_id);
			ProgrammingTaskUtil.onTaskCreation(task_id);
		}, 100);
	},
	getExitLabels: function(task_property_values) {
		var labels = {
			"default_exit": "Default"
		};
		if (task_property_values && task_property_values["exits"]) {
			var exits = task_property_values["exits"];
			labels["default_exit"] = exits["default_exit"] && exits["default_exit"]["label"] ? exits["default_exit"]["label"] : labels["default_exit"];
		}
		var cases = task_property_values["cases"] && task_property_values["cases"]["case"] ? task_property_values["cases"]["case"] : null;
		if (cases) {
			if (cases["exit"]) {
				cases = [cases];
			}
			for (var i in cases) {
				var c = cases[i];
				var exit_id = c["exit"];
				if (exit_id && exit_id != "default_exit") {
					labels[exit_id] = typeof c["value"] != "undefined" || typeof c["value"] != null ? c["value"] : "";
				}
			}
		}
		return labels;
	},
	
	getCode: function(task_property_values) {
		return "some switch code...";
	}
};
