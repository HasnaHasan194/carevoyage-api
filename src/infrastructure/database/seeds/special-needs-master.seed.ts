// /**
//  * Seed script for special_needs_master collection
//  * Run this script to populate the master list of special needs
//  * 
//  * Usage: You can run this manually via MongoDB or create a migration script
//  */

// export const specialNeedsMasterSeedData = [
//   // Mobility & Physical Support
//   {
//     name: "Wheelchair Assistance",
//     shortCode: "WHEELCHAIR",
//     category: "Mobility & Physical Support",
//     description: "Wheelchair support at airports, hotels, tourist spots, and throughout the journey",
//     isActive: true,
//   },
//   {
//     name: "Accessible Transport (Wheelchair-Friendly Vehicle)",
//     shortCode: "ACCESSIBLE_TRANSPORT",
//     category: "Mobility & Physical Support",
//     description: "Vehicle with ramp or low step entry for easy wheelchair access",
//     isActive: true,
//   },
//   {
//     name: "Walking Support Equipment",
//     shortCode: "WALKING_SUPPORT",
//     category: "Mobility & Physical Support",
//     description: "Walker or walking stick support and assistance",
//     isActive: true,
//   },
//   {
//     name: "Low-Stair / Ground-Floor Accommodation Preference",
//     shortCode: "LOW_STAIR_ACCOMMODATION",
//     category: "Mobility & Physical Support",
//     description: "Hotels or stays with minimal stairs or elevator access",
//     isActive: true,
//   },

//   // Dietary & Health-Friendly Meals
//   {
//     name: "General Special Meal (Soft / Easy-to-Chew Food)",
//     shortCode: "SOFT_MEAL",
//     category: "Dietary & Health-Friendly Meals",
//     description: "For elderly or people with chewing/swallowing difficulty",
//     isActive: true,
//   },
//   {
//     name: "Diabetic-Friendly Meal",
//     shortCode: "DIABETIC_MEAL",
//     category: "Dietary & Health-Friendly Meals",
//     description: "Meals designed for diabetic dietary requirements",
//     isActive: true,
//   },
//   {
//     name: "Low-Sodium / Heart-Friendly Meal",
//     shortCode: "LOW_SODIUM_MEAL",
//     category: "Dietary & Health-Friendly Meals",
//     description: "Meals with reduced sodium content for heart health",
//     isActive: true,
//   },
//   {
//     name: "Allergy-Safe Meal",
//     shortCode: "ALLERGY_SAFE_MEAL",
//     category: "Dietary & Health-Friendly Meals",
//     description: "Meals prepared with strict allergen avoidance protocols",
//     isActive: true,
//   },

//   // Communication Support
//   {
//     name: "Sign Language Interpreter Support",
//     shortCode: "SIGN_LANGUAGE_INTERPRETER",
//     category: "Communication Support",
//     description: "Professional sign language interpreter for hearing-impaired travelers",
//     isActive: true,
//   },
//   {
//     name: "Visual Assistance Tools",
//     shortCode: "VISUAL_ASSISTANCE",
//     category: "Communication Support",
//     description: "Large-print itinerary, audio guidance, braille-friendly information",
//     isActive: true,
//   },
//   {
//     name: "Hearing Support Equipment",
//     shortCode: "HEARING_SUPPORT",
//     category: "Communication Support",
//     description: "Portable hearing assistance device (if available)",
//     isActive: true,
//   },

//   // Medical Utilities
//   {
//     name: "Oxygen Cylinder Support",
//     shortCode: "OXYGEN_CYLINDER",
//     category: "Medical Utilities",
//     description: "Oxygen cylinder support and management during travel",
//     isActive: true,
//   },
//   {
//     name: "Portable Medical Equipment Support",
//     shortCode: "PORTABLE_MEDICAL_EQUIPMENT",
//     category: "Medical Utilities",
//     description: "BP monitor, pulse oximeter, and other agency-provided medical utilities",
//     isActive: true,
//   },
// ];

// /**
//  * Example MongoDB insert command:
//  * 
//  * db.special_needs_masters.insertMany([
//  *   { name: "Wheelchair Assistance", shortCode: "WHEELCHAIR", category: "Mobility & Physical Support", description: "...", isActive: true, createdAt: new Date(), updatedAt: new Date() },
//  *   // ... add all items from specialNeedsMasterSeedData
//  * ])
//  */
