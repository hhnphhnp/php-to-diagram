<?php
$save = @$_POST["save"];
$data = @$_POST["data"];
$file_read_date = @$_POST["file_read_date"];

$fp = __DIR__ . "/saved_test_tasks.json";

if ($save) {
	$content = json_encode($data);
	$status = file_put_contents($fp, $content) !== false;
	
	echo $status;
}
?>
