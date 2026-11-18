<?php
/**
 * Installs the local concept-demo site. Run from the folder that contains site/ (WordPress) after creating
 * the database and wp-config.php. The admin password is read from the environment and never stored here:
 *   WP_ADMIN_PASS='choose-a-local-password' php install.php
 */
$pass = getenv('WP_ADMIN_PASS');
if (!$pass) { fwrite(STDERR, "Set WP_ADMIN_PASS (local only).\n"); exit(1); }
define('WP_INSTALLING', true);
$_SERVER['HTTP_HOST'] = getenv('WP_HOST') ?: '127.0.0.1:8090';
require getcwd() . '/site/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/upgrade.php';
if (!is_blog_installed()) wp_install('Harbourline Advisory', 'demo-admin', 'demo@example.com', false, '', $pass);
update_option('blogdescription', 'Fictional consulting firm · VEXARI concept demo');
update_option('permalink_structure', '/%postname%/');
update_option('blog_public', 0); // local demo: discourage search engines
switch_theme('kadence');
require_once ABSPATH . 'wp-admin/includes/plugin.php';
$r = activate_plugin('kadence-blocks/kadence-blocks.php');
echo is_wp_error($r) ? 'plugin error: ' . $r->get_error_message() . "\n" : "installed\n";
