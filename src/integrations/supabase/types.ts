export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      amenities: {
        Row: {
          category: string | null
          icon: string | null
          id: string
          name: string
          sort_order: number | null
        }
        Insert: {
          category?: string | null
          icon?: string | null
          id?: string
          name: string
          sort_order?: number | null
        }
        Update: {
          category?: string | null
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          cover_image: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          read_time_minutes: number | null
          slug: string
          tags: string[] | null
          title: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug: string
          tags?: string[] | null
          title: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          package_id: string | null
          phone: string | null
          property_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          package_id?: string | null
          phone?: string | null
          property_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          package_id?: string | null
          phone?: string | null
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      nearby_attractions: {
        Row: {
          category: string | null
          description: string | null
          distance_km: number | null
          id: string
          name: string
          property_id: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          distance_km?: number | null
          id?: string
          name: string
          property_id?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          distance_km?: number | null
          id?: string
          name?: string
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nearby_attractions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      package_gallery: {
        Row: {
          alt_text: string | null
          display_order: number | null
          id: string
          image_url: string
          package_id: string
        }
        Insert: {
          alt_text?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          package_id: string
        }
        Update: {
          alt_text?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_gallery_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          coordinates: Json | null
          created_at: string | null
          distance_km: number | null
          duration_days: number | null
          duration_nights: number | null
          hero_images: string[] | null
          highlights: string[] | null
          id: string
          instagram_hashtag: string | null
          is_featured: boolean | null
          is_published: boolean | null
          itinerary: Json | null
          location: string | null
          max_participants: number | null
          min_participants: number | null
          name: string
          price_inr: number | null
          region: string | null
          slug: string
          sort_order: number | null
          tags: string[] | null
          terms_conditions: string[] | null
          updated_at: string | null
          whats_included: string[] | null
          whats_not_included: string[] | null
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string | null
          distance_km?: number | null
          duration_days?: number | null
          duration_nights?: number | null
          hero_images?: string[] | null
          highlights?: string[] | null
          id?: string
          instagram_hashtag?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          itinerary?: Json | null
          location?: string | null
          max_participants?: number | null
          min_participants?: number | null
          name: string
          price_inr?: number | null
          region?: string | null
          slug: string
          sort_order?: number | null
          tags?: string[] | null
          terms_conditions?: string[] | null
          updated_at?: string | null
          whats_included?: string[] | null
          whats_not_included?: string[] | null
        }
        Update: {
          coordinates?: Json | null
          created_at?: string | null
          distance_km?: number | null
          duration_days?: number | null
          duration_nights?: number | null
          hero_images?: string[] | null
          highlights?: string[] | null
          id?: string
          instagram_hashtag?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          itinerary?: Json | null
          location?: string | null
          max_participants?: number | null
          min_participants?: number | null
          name?: string
          price_inr?: number | null
          region?: string | null
          slug?: string
          sort_order?: number | null
          tags?: string[] | null
          terms_conditions?: string[] | null
          updated_at?: string | null
          whats_included?: string[] | null
          whats_not_included?: string[] | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          cover_image: string | null
          created_at: string | null
          description: string | null
          district: string
          highlights: string[] | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          max_guests: number
          min_nights: number | null
          name: string
          nearest_airport: string | null
          nearest_airport_distance: string | null
          nearest_railway: string | null
          nearest_railway_distance: string | null
          price_per_night: number | null
          property_type: string
          slug: string
          sort_order: number | null
          tagline: string | null
          tags: string[] | null
          terms_conditions: string[] | null
          travel_tips: string | null
          updated_at: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          district: string
          highlights?: string[] | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          max_guests?: number
          min_nights?: number | null
          name: string
          nearest_airport?: string | null
          nearest_airport_distance?: string | null
          nearest_railway?: string | null
          nearest_railway_distance?: string | null
          price_per_night?: number | null
          property_type: string
          slug: string
          sort_order?: number | null
          tagline?: string | null
          tags?: string[] | null
          terms_conditions?: string[] | null
          travel_tips?: string | null
          updated_at?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          district?: string
          highlights?: string[] | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          max_guests?: number
          min_nights?: number | null
          name?: string
          nearest_airport?: string | null
          nearest_airport_distance?: string | null
          nearest_railway?: string | null
          nearest_railway_distance?: string | null
          price_per_night?: number | null
          property_type?: string
          slug?: string
          sort_order?: number | null
          tagline?: string | null
          tags?: string[] | null
          terms_conditions?: string[] | null
          travel_tips?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      property_amenities: {
        Row: {
          amenity_id: string
          property_id: string
        }
        Insert: {
          amenity_id: string
          property_id: string
        }
        Update: {
          amenity_id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          image_url: string
          property_id: string | null
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          property_id?: string | null
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          property_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_types: {
        Row: {
          collection: string | null
          cover_image: string | null
          created_at: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
          subtitle: string | null
        }
        Insert: {
          collection?: string | null
          cover_image?: string | null
          created_at?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
          subtitle?: string | null
        }
        Update: {
          collection?: string | null
          cover_image?: string | null
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
          subtitle?: string | null
        }
        Relationships: []
      }
      regions: {
        Row: {
          created_at: string | null
          id: string
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string | null
          guest_name: string
          guest_title: string | null
          id: string
          initials: string | null
          is_approved: boolean | null
          is_featured: boolean | null
          package_id: string | null
          property_id: string | null
          quote: string
          sort_order: number | null
          stayed_at: string | null
        }
        Insert: {
          created_at?: string | null
          guest_name: string
          guest_title?: string | null
          id?: string
          initials?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          package_id?: string | null
          property_id?: string | null
          quote: string
          sort_order?: number | null
          stayed_at?: string | null
        }
        Update: {
          created_at?: string | null
          guest_name?: string
          guest_title?: string | null
          id?: string
          initials?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          package_id?: string | null
          property_id?: string | null
          quote?: string
          sort_order?: number | null
          stayed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      room_type_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          image_url: string
          room_type_id: string
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          room_type_id: string
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          room_type_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_type_images_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          bed_type: string | null
          created_at: string | null
          description: string | null
          id: string
          max_guests: number | null
          name: string
          price_per_night: number | null
          property_id: string | null
          sort_order: number | null
        }
        Insert: {
          bed_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_guests?: number | null
          name: string
          price_per_night?: number | null
          property_id?: string | null
          sort_order?: number | null
        }
        Update: {
          bed_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_guests?: number | null
          name?: string
          price_per_night?: number | null
          property_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: string | null
          id: string
          name: string
          photo_url: string | null
          role: string
          sort_order: number | null
        }
        Insert: {
          bio?: string | null
          id?: string
          name: string
          photo_url?: string | null
          role: string
          sort_order?: number | null
        }
        Update: {
          bio?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          role?: string
          sort_order?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
