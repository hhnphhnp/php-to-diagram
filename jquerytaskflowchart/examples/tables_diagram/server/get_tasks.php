<?php
$fp = __DIR__ . "/saved_test_tasks.json";

if (file_exists($fp))
	echo file_get_contents($fp);
?>
