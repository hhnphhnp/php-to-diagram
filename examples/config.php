<?php
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

include_once dirname(__DIR__) . "/lib/app.php";

//SET SOME STYLING
$style = '<style>
h1 {margin-bottom:0; text-align:center;}
h3 {font-size:1.4em; margin:40px 0 0; font-weight:bold;}
h4 {font-size:1.2em; margin:40px 0 0; font-weight:bold;}
h5 {font-size:1em; margin:40px 0 0; font-weight:bold;}
p {margin:0 0 20px; text-align:center;}

.note {text-align:center;}
.note span {text-align:center; margin:0 20px 20px; padding:10px; color:#aaa; border:1px solid #ccc; background:#eee; display:inline-block; border-radius:3px;}

.error {margin:20px 0; text-align:center; color:red;}

.code {display:block; margin:10px 0; padding:0; background:#eee; border:1px solid #ccc; border-radius:3px; position:relative;}
.code:before {content:"php"; position:absolute; top:5px; left:5px; display:block; font-size:80%; opacity:.5;}
.code.xml:before {content:"xml";}
.code textarea {width:100%; height:300px; padding:30px 10px 10px; display:inline-block; background:transparent; border:0; resize:vertical; font-family:monospace;}
.code.short textarea {height:160px;}
</style>';

$tmp_folder = __DIR__ . "/tmp/";
$cache_folder_path = $tmp_folder . "cache/";
$webroot_cache_folder_path = $tmp_folder . "public/";
$webroot_cache_folder_url = getCurrentUrl() . "tmp/public/";

function getCurrentUrl() {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $host     = $_SERVER['HTTP_HOST'];
    $request  = $_SERVER['REQUEST_URI'];

    return $protocol . $host . $request;
}
?>
