<?php
/**
 * Creates the Home page from the saved Kadence block markup (home-page-blocks.html), applies the Kadence Theme
 * page settings and the primary menu, and sets it as the front page.   php create-home.php
 */
$_SERVER['HTTP_HOST'] = getenv('WP_HOST') ?: '127.0.0.1:8090';
require getcwd() . '/site/wp-load.php';
$id = wp_insert_post(['post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Home',
  'post_content' => wp_slash(file_get_contents(__DIR__ . '/home-page-blocks.html'))]);
foreach (['_kad_post_title' => 'hide', '_kad_post_layout' => 'fullwidth', '_kad_post_content_style' => 'unboxed', '_kad_post_vertical_padding' => 'hide'] as $k => $v) update_post_meta($id, $k, $v);
update_option('show_on_front', 'page'); update_option('page_on_front', $id);
$menu = wp_get_nav_menu_object('Main') ?: get_term(wp_create_nav_menu('Main'), 'nav_menu');
foreach ([['Services', '#services'], ['Approach', '#approach'], ['FAQ', '#faq'], ['Contact', '#contact']] as $i => [$t, $u])
  wp_update_nav_menu_item($menu->term_id, 0, ['menu-item-title' => $t, 'menu-item-url' => home_url('/' . $u), 'menu-item-status' => 'publish', 'menu-item-position' => $i + 1]);
set_theme_mod('nav_menu_locations', ['primary' => $menu->term_id, 'mobile' => $menu->term_id]);
echo "home page $id created\n";
