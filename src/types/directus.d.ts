export interface DirectusCollection {

	/** @required */
	collection: string;
	icon?: string | null;
	note?: string | null;
	display_template?: string | null;
	hidden?: boolean;
	singleton?: boolean;
	translations?: {
    language: string;
    translation: string;
    singular: string;
    plural: string
  }[] | null;
	archive_field?: string | null;
	archive_app_filter?: boolean;
	archive_value?: string | null;
	unarchive_value?: string | null;
	sort_field?: string | null;
	accountability?: 'all' | 'activity' | null | null;
	color?: string | null;
	item_duplication_fields?: any | null;
	sort?: number | null;
	group?: DirectusCollection | string | null;
	collapse?: string;
	preview_url?: string | null;
	versioning?: boolean;
  schema?: any | null;
  meta?: any | null;
}

export interface DirectusField {

	/** @required */
	id: number;
	type: "text" | "uuid" | "integer" | "float" | "boolean" | "date" | "datetime" | "json" | "geometry" | "point" | "line" | "polygon" | "image" | "file" | "video" | "audio" | "link" | "color" | "select" | "multi_select" | "geo_point" | "geo_line" | "geo_polygon" | "geo_json" | "jsonb" | "uuid" | "text" | "integer" | "float" | "boolean" | "date" | "datetime" | "json" | "geometry" | "point" | "line" | "polygon" | "image" | "file" | "video" | "audio" | "link" | "color" | "select" | "multi_select" | "geo_point" | "geo_line" | "geo_polygon" | "geo_json" | "jsonb";
	collection?: DirectusCollection | string;
	field?: string;
	special?: string[] | null;
	interface?: string | null;
	options?: any | null;
	display?: string | null;
	display_options?: any | null;
	readonly?: boolean;
	hidden?: boolean;
	sort?: number | null;
	width?: string | null;
	translations?: any | null;
	note?: string | null;
	conditions?: any | null;
	required?: boolean | null;
	group?: DirectusField | string | null;
	validation?: any | null;
	validation_message?: string | null;
  schema?: any | null;
  meta?: any | null;
}

export interface DirectusRelation {

	/** @required */
	id: number;
	many_collection?: string;
	many_field?: string;
	one_collection?: string | null;
	one_field?: string | null;
	one_collection_field?: string | null;
	one_allowed_collections?: string[] | null;
	junction_field?: string | null;
	sort_field?: string | null;
	one_deselect_action?: string;
  schema?: any | null;
  meta?: any | null;
}
