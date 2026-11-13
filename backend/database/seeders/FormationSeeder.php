<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Formation;

class FormationSeeder extends Seeder
{
    public function run(): void
    {
        $formations = [
            [
                'name' => 'Licence Informatique',
                'slug' => 'licence-informatique-demo',
                'degree' => 'Licence',
                'institution' => 'Établissement de démonstration',
                'institution_type' => 'universite',
                'city' => 'Ouarzazate',
                'region' => 'Drâa-Tafilalet',

                'education_levels' => ['bac', 'bac_plus_2'],
                'accepted_streams' => [
                    'Sciences Physiques',
                    'Sciences Mathématiques',
                ],

                'accepted_diplomas' => [],
                'accepted_specializations' => [],

                'fields' => [
                    'informatique',
                    'developpement web',
                ],

                'admission_conditions' => [
                    'Conditions de test uniquement',
                ],

                'admission_method' => 'selection',
                'minimum_average' => null,

                'official_url' => null,
                'source_name' => 'Données de démonstration',
                'last_verified' => null,
                'is_active' => false,
            ],

            [
                'name' => 'Licence Génie Logiciel',
                'slug' => 'licence-genie-logiciel-demo',
                'degree' => 'Licence',
                'institution' => 'Établissement de démonstration',
                'institution_type' => 'universite',
                'city' => 'Agadir',
                'region' => 'Souss-Massa',

                'education_levels' => ['bac_plus_2'],
                'accepted_streams' => ['Sciences Physiques'],

                'accepted_diplomas' => [],
                'accepted_specializations' => [],

                'fields' => [
                    'informatique',
                    'genie logiciel',
                ],

                'admission_conditions' => [
                    'Condition de test uniquement',
                ],

                'admission_method' => 'selection',
                'minimum_average' => 12,

                'official_url' => null,
                'source_name' => 'Données de démonstration',
                'last_verified' => null,
                'is_active' => false,
            ],

            [
                'name' => 'Licence Data Science',
                'slug' => 'licence-data-science-demo',
                'degree' => 'Licence',
                'institution' => 'Établissement de démonstration',
                'institution_type' => 'universite',
                'city' => 'Marrakech',
                'region' => 'Marrakech-Safi',

                'education_levels' => ['bac_plus_2'],
                'accepted_streams' => ['Sciences Physiques'],

                'accepted_diplomas' => [],
                'accepted_specializations' => [],

                'fields' => [
                    'data science',
                    'intelligence artificielle',
                ],

                'admission_conditions' => [
                    'Conditions de test uniquement',
                ],

                'admission_method' => 'selection',
                'minimum_average' => null,

                'official_url' => null,
                'source_name' => 'Données de démonstration',
                'last_verified' => null,
                'is_active' => false,
            ],
        ];

        foreach ($formations as $formation) {
            Formation::updateOrCreate(
                ['slug' => $formation['slug']],
                $formation
            );
        }
    }
}
