/*
 * Copyright (c) 2025 Bloxtor (http://bloxtor.com) and Joao Pinto (http://jplpinto.com)
 * 
 * Multi-licensed: BSD 3-Clause | Apache 2.0 | GNU LGPL v3 | HLNC License (http://bloxtor.com/LICENSE_HLNC.md)
 * Choose one license that best fits your needs.
 *
 * Original PHP to Diagram Repo: https://github.com/a19836/php-to-diagram/
 * Original Bloxtor Repo: https://github.com/a19836/bloxtor
 *
 * YOU ARE NOT AUTHORIZED TO MODIFY OR REMOVE ANY PART OF THIS NOTICE!
 */

var default_code = "<?php \n"
	+ "//some if\n"
	+ "$x = 12;\n"
	+ "\n"
	+ "if ($x > 10)\n"
	+ "	$y = foo();\n"
	+ "\n"
	+ "//prepare var\n"
	+ "$list = array(1, 2, 3);\n"
	+ "\n"
	+ "//print list\n"
	+ "foreach ($list as $item)\n"
	+ "	echo $y . \" - \" . $item;\n"
	+ "?>";

$(function() {
	$(".phptoworkflow").tabs({active: 1});
	
	var textarea = $(".code textarea");
	var editor = createCodeEditor(textarea[0], {
		save_func: saveCode
	});
	
	getCode(function() {
		//$(".phptoworkflow").tabs("option", "active", 0);
		setEditorCodeRawValue(default_code);
		
		generateTasksFlowFromCode(true, {
			success: function() {
				//console.log(taskFlowChartObj.TaskFile.getWorkFlowData());
				
				var save_options = {
					overwrite: true,
					silent: true,
					do_not_silent_errors: true,
				};
				taskFlowChartObj.TaskFile.save(null, save_options);
				saveCode(save_options);
				
				StatusMessageHandler.showMessage("Tmp files created successfully with default code");
			}
		});
	});
});

function sortWorkflowTask(sort_type) {
	taskFlowChartObj.getMyFancyPopupObj().init({
		parentElement: $("#" + taskFlowChartObj.TaskFlow.main_tasks_flow_obj_id),
	});
	taskFlowChartObj.getMyFancyPopupObj().showOverlay();
	taskFlowChartObj.getMyFancyPopupObj().showLoading();
	
	if (!sort_type) {
		sort_type = prompt("Please choose the sort type that you wish? You can choose 1, 2, 3 or 4.");
	}
	
	if (sort_type) {
		taskFlowChartObj.TaskSort.sortTasks(sort_type);
		taskFlowChartObj.StatusMessage.showMessage("Done sorting tasks based in the sort type: " + sort_type + ".", "", "bottom_messages", 1500);
	}
	
	taskFlowChartObj.getMyFancyPopupObj().hidePopup();
}

function repaintAllTasks() {
	taskFlowChartObj.getMyFancyPopupObj().init({
		parentElement: $("#" + taskFlowChartObj.TaskFlow.main_tasks_flow_obj_id),
	});
	taskFlowChartObj.getMyFancyPopupObj().showOverlay();
	taskFlowChartObj.getMyFancyPopupObj().showLoading();
	
	taskFlowChartObj.TaskFlow.repaintAllTasks();
	
	taskFlowChartObj.getMyFancyPopupObj().hidePopup();
}

function createCodeEditor(textarea, options) {
	var parent = $(textarea).parent();
	var mode = options && options["mode"] ? options["mode"] : null;
	mode = mode ? mode : "php";
	
	var editor = ace.edit(textarea);
	editor.setTheme("ace/theme/chrome");
	editor.session.setMode("ace/mode/" + mode);
	editor.setAutoScrollEditorIntoView(true);
	editor.setOption("minLines", 5);
	editor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true,
	});
	editor.setOption("wrap", true);
	
	if (typeof setCodeEditorAutoCompleter == "function")
		setCodeEditorAutoCompleter(editor);
	
	//add on key press event
	/*editor.keyBinding.addKeyboardHandler(function(data, hashId, keyString, keyCode, e) {
		console.log(data);
		console.log(hashId);
		console.log(keyString);
		console.log(keyCode);
		console.log(e);
	});*/
	
	if (options && typeof options.save_func == "function") {
		editor.commands.addCommand({
			name: 'saveFile',
			bindKey: {
				win: 'Ctrl-S',
				mac: 'Command-S',
				sender: 'editor|cli'
			},
			exec: function(env, args, request) {
				options.save_func();
			},
		});
	}
	
	if (options && typeof options.change_func == "function")
		editor.on("change", options.change_func);
	
	if (options && typeof options.blur_func == "function")
		editor.on("blur", options.blur_func);
	
	parent.find("textarea.ace_text-input").removeClass("ace_text-input"); //fixing problem with scroll up, where when focused or pressed key inside editor the page scrolls to top.
	
	parent.data("editor", editor);
	
	return editor;
}

function setEditorCodeRawValue(code) {
	var editor = $("#code").data("editor");
	
	if (editor) 
		editor.setValue(code, 1);
	else
		$("#code textarea").val(code);
}

function getEditorCodeRawValue() {
	var code = "";
	var editor = $("#code").data("editor");
	
	if (editor) 
		code = editor.getValue();
	else
		code = $("#code textarea").val();
	
	return code;
}

function getEditorCodeValue() {
	var code = getEditorCodeRawValue();
	
	if (code) {
		code = code ? code.trim() : "";
	
		if (code != "") {
			if (code.substr(0, 2) == "<?") {
				code = code.substr(0, 5) == "<?php" ? code.substr(5) : (code.substr(0, 2) == "<?" ? code.substr(2) : code);
			}
			else {
				code = "?>\n" + code;
			}
		
			if (code.substr(code.length - 2) == "?>") {
				code = code.substr(0, code.length - 2);
			}
		
			else if (code.lastIndexOf("<?") < code.lastIndexOf("?>")) {//this means that exists html elements at the end of the file
				code += "\n<?php";
			}
			
			while(code.indexOf("<?php\n?>") != -1) {
				code = code.replace("<?php\n?>", "");
			}
			
			code = code.trim();
		}
	}
	
	return code;
}

function getEditorCodeErrors() {
	var errors = [];
	var editor = $("#code").data("editor");
	
	if (editor) {
		var annotations = editor.getSession().getAnnotations();
		//console.log(annotations);
		
		if (annotations)
			errors = annotations.filter(function(annotation) {
				return annotation["type"] == "error";
			});
	}
	
	return errors;
}

function isEditorCodeWithErrors() {
	var errors = getEditorCodeErrors();
	return errors.length > 0;
}

function prettyPrintCode() {
	var code = getEditorCodeRawValue();
	code = MyHtmlBeautify.beautify(code);
	code = code.replace(/^\s+/g, "").replace(/\s+$/g, "");
	console.log(code);
	setEditorCodeRawValue(code);
}

function setWordWrap(elm) {
	var editor = $("#code").data("editor");
	
	if (editor) {
		var wrap = $(elm).attr("wrap") != 1 ? false : true;
		$(elm).attr("wrap", wrap ? 0 : 1);
		
		editor.getSession().setUseWrapMode(wrap);
		StatusMessageHandler.showMessage("Wrap is now " + (wrap ? "enable" : "disable"));
	}
}

function openEditorSettings() {
	var editor = $("#code").data("editor");
	
	if (editor) {
		editor.execCommand("showSettingsMenu");
		
		//prepare font size option
		setTimeout(function() {
			var input = $("#ace_settingsmenu input#setFontSize");
			
			if (input[0]) {
				var value = input.val();
				var title = "eg: 12px, 12em, 12rem, 12pt or 120%";
				
				input.attr("title", title).attr("placeHolder", title);
				input.after('<div style="text-align:right; opacity:.5;">' + title + '</div>');
				
				if ($.isNumeric(value))
					input.val(value + "px");
				
				if (input.data("with_keyup_set") != 1) {
					input.data("with_keyup_set", 1);
					
					input.on("keyup", function() {
						var v = $(this).val();
						
						if (v.match(/([0-9]+(\.[0-9]*)?|\.[0-9]+)(px|em|rem|%|pt)/i))
							$(this).trigger("blur").focus();
					});
				}
			}
		}, 300);
	}
	else {
		StatusMessageHandler.showError("Error trying to open the editor settings...");
	}
}

function getCode(empty_callback) {
	if (get_code_file_url) {
		MyFancyPopup.init({
			parentElement: window,
		});
		MyFancyPopup.showOverlay();
		MyFancyPopup.showLoading();
		
		$.ajax({
			type : "get",
			url : get_code_file_url,
			dataType : "json",
			success : function(data, textStatus, jqXHR) {
				if (data) {
					if (data["code"])
						setEditorCodeRawValue(data["code"]);
					else if (data["error"])
						StatusMessageHandler.showError("Error getting code.\n" + data["error"]);
				}
				else if (typeof empty_callback == "function")
					empty_callback();
					
				MyFancyPopup.hidePopup();
			},
			error : function(jqXHR, textStatus, errorThrown) { 
				var msg = jqXHR.responseText ? "\n" + jqXHR.responseText : "";
				taskFlowChartObj.StatusMessage.showError("There was an error trying to update this workflow. Please try again." + msg);
				
				MyFancyPopup.hidePopup();
			},
		});
	}
}

function saveCode(options) {
	if (set_code_file_url) {
		MyFancyPopup.init({
			parentElement: window,
		});
		MyFancyPopup.showOverlay();
		MyFancyPopup.showLoading();
		
		var code = getEditorCodeRawValue();
		var silent = options && $.isPlainObject(options) && options["silent"];
		
		$.ajax({
			type : "post",
			url : set_code_file_url,
			data : code,
			dataType : "text",
			success : function(data, textStatus, jqXHR) {
				if (data == 1) {
					status = true;
					
					if (!silent)
						StatusMessageHandler.showMessage("Saved");
				}
				else
					StatusMessageHandler.showError("Not saved." + (data ? "\n" + data : ""));
				
				MyFancyPopup.hidePopup();
			},
			error : function(jqXHR, textStatus, errorThrown) { 
				var msg = jqXHR.responseText ? "\n" + jqXHR.responseText : "";
				taskFlowChartObj.StatusMessage.showError("There was an error trying to update this workflow. Please try again." + msg);
				
				MyFancyPopup.hidePopup();
			},
		});
	}
}

function generateCodeFromTasksFlow(do_not_confirm) {
	var status = true;
	
	if (do_not_confirm || confirm("Do you wish to update this code accordingly with the tasks diagram?")) {
		status = false;
		
		var save_options = {
			overwrite: true,
			silent: true,
			do_not_silent_errors: true,
		};
		
		if (taskFlowChartObj.TaskFile.save(set_tmp_tasks_file_url, save_options)) {
			//if not default start task, the system will try to figure out one by default, but is always good to show a message to the user alerting him of this situation...
			var exists_start_tasks = $("#" + taskFlowChartObj.TaskFlow.main_tasks_flow_obj_id + " ." + taskFlowChartObj.TaskFlow.task_class_name + "." + taskFlowChartObj.TaskFlow.start_task_class_name).length > 0;
			
			if (!exists_start_tasks)
				StatusMessageHandler.showMessage("There is no startup task selected. The system tried to select a default one, but is more reliable if you define one manually...");
			
			var url = diagram_to_code_url;
			url += (url.indexOf("?") != -1 ? "" : "?") + "&time=" + (new Date()).getTime();
			
			$.ajax({
				type : "get",
				url : url,
				dataType : "json",
				success : function(data, textStatus, jqXHR) {
					if (data && data.hasOwnProperty("code")) {
						var code = "<?php\n" + data.code.trim() + "\n?>";
						code = code.replace(/^<\?php\s+\?>\s*/, "").replace(/<\?php\s+\?>$/, ""); //remove empty php tags
						
						setEditorCodeRawValue(code);
						
						if (data["error"] && data["error"]["infinit_loop"] && data["error"]["infinit_loop"][0]) {
							var loops = data["error"]["infinit_loop"];
							
							var msg = "";
							for (var i = 0; i < loops.length; i++) {
								var loop = loops[i];
								var slabel = taskFlowChartObj.TaskFlow.getTaskLabelByTaskId(loop["source_task_id"]);
								var tlabel = taskFlowChartObj.TaskFlow.getTaskLabelByTaskId(loop["target_task_id"]);
								
								msg += (i > 0 ? "\n" : "") + "- '" + slabel + "' => '" + tlabel + "'";
							}
							
							msg = "The system detected the following invalid loops and discarded them from the code:\n" + msg + "\n\nYou should remove them from the workflow and apply the correct 'loop task' for doing loops.";
							taskFlowChartObj.StatusMessage.showError(msg);
							
							StatusMessageHandler.showError(msg);
						}
						else
							status = true;
					}
					else
						taskFlowChartObj.StatusMessage.showError("There was an error trying to update this code. Please try again.");
					
				},
				error : function(jqXHR, textStatus, errorThrown) { 
					var msg = jqXHR.responseText ? "\n" + jqXHR.responseText : "";
					taskFlowChartObj.StatusMessage.showError("There was an error trying to update this code. Please try again." + msg);
				},
			});
		}
		else
			taskFlowChartObj.StatusMessage.showError("There was an error trying to update this code. Please try again.");
	}
	
	return status;
}

function generateTasksFlowFromCode(do_not_confirm, options) {
	var status = true;
	
	//only if no errors detected
	var errors = getEditorCodeErrors();
	
	if (errors.length == 0) {
		var code = getEditorCodeRawValue();
		
		if (do_not_confirm || confirm("Do you wish to update this workflow accordingly with the code in the editor?")) {
			status = false;
			
			taskFlowChartObj.getMyFancyPopupObj().hidePopup();
			MyFancyPopup.init({
				parentElement: window,
			});
			MyFancyPopup.showOverlay();
			MyFancyPopup.showLoading();
			
			$.ajax({
				type : "post",
				url : code_to_diagram_url,
				data : code,
				dataType : "text",
				success : function(data, textStatus, jqXHR) {
					if (data == 1) {
						var previous_callback = taskFlowChartObj.TaskFile.on_success_read;
						var previous_tasks_flow_saved_data_obj = taskFlowChartObj.TaskFile.saved_data_obj; //save the previous TaskFile.saved_data_obj, bc when we run the TaskFile.reload method, this var will be with the new workflow data obj and then the auto_save won't run bc the TaskFile.isWorkFlowChangedFromLastSaving will return false. So we must save this var before and then re-put it again with the previous value.
						
						//check if there is any task properties open and if it is, hide then, bc they won't do anything bc the tasks will be new and with new ids, so the task properties that were previously open, doesn't belong to any of the new tasks. So for a good user-experience, we need to close them.
						if (taskFlowChartObj.Property.isSelectedTaskPropertiesOpen())
							taskFlowChartObj.Property.hideSelectedTaskProperties();
						else if (taskFlowChartObj.Property.isSelectedConnectionPropertiesOpen())
							taskFlowChartObj.Property.hideSelectedConnectionProperties();
						
						taskFlowChartObj.TaskFile.on_success_read = function(data, text_status, jqXHR) {
							if (!data) {
								taskFlowChartObj.StatusMessage.showError("There was an error trying to load the workflow's tasks.");
							}
							else {
								//sort tasks
								taskFlowChartObj.TaskSort.sortTasks();
								
								setTimeout(function() { //must be in timeout otherwise the connections will appear weird
									taskFlowChartObj.TaskFlow.repaintAllTasks();
								}, 5);
								
								status = true;
							}
							
							//The TaskFile will call after this function the TaskFile.startAutoSave method which updates the TaskFile.saved_data_obj var with the new workflow data obj. So we must execute a setTimeout so we can then update the old value to the TaskFile.saved_data_obj var.
							setTimeout(function() {
								taskFlowChartObj.TaskFile.saved_data_obj = previous_tasks_flow_saved_data_obj;
							}, 100);
							
							taskFlowChartObj.TaskFile.on_success_read = previous_callback;
						}
						
						taskFlowChartObj.TaskFile.reload(get_tmp_tasks_file_url, {
							success: function() {
								if (options && $.isPlainObject(options) && typeof options["success"] == "function")
									options["success"]();
							},
							error: function() {
								
							}
						});
					}
					else {
						taskFlowChartObj.StatusMessage.showError("There was an error trying to update this workflow. Please try again." + (data ? "\n" + data : ""));
					}
					
					MyFancyPopup.hidePopup();
				},
				error : function(jqXHR, textStatus, errorThrown) { 
					var msg = jqXHR.responseText ? "\n" + jqXHR.responseText : "";
					taskFlowChartObj.StatusMessage.showError("There was an error trying to update this workflow. Please try again." + msg);
					
					MyFancyPopup.hidePopup();
				},
			});
		}
	}
	else {
		//show errors
		var msg = "";
		
		for (var i = 0, t = errors.length; i < t; i++) {
			var error = errors[i];
			msg += "\n- " + error["text"];
			
			if ($.isNumeric(error["row"]))
				msg += " in line " + error["row"] + ($.isNumeric(error["column"]) ? ", " + error["column"] : "");
			 
			 msg += ".";
		}
		//console.log(msg);
		
		StatusMessageHandler.showError("The code has the following errors, which means we cannot update the tasks flow diagram:" + msg);
	}
	
	return status;
}
