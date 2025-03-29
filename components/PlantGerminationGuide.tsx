import { PlantGerminationGuide as GerminationGuideType } from "../utils/schema.ts";

interface Props {
  guides: GerminationGuideType[];
}

export default function PlantGerminationGuideComponent({ guides }: Props) {
  if (!guides || guides.length === 0) {
    return (
      <div class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>No germination guides available for this plant.</span>
      </div>
    );
  }

  return (
    <div class="space-y-4">
      {guides.map((guide) => (
        <div key={guide.id} class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <h3 class="card-title">
              Growing Zone: {guide.zone_range}
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="stats bg-base-100 shadow">
                <div class="stat">
                  <div class="stat-title">Soil Temperature</div>
                  <div class="stat-value text-lg">
                    {guide.soil_temp_min_c}°C - {guide.soil_temp_max_c}°C
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title">Days to Germination</div>
                  <div class="stat-value text-lg">
                    {guide.days_to_germination_min} - {guide.days_to_germination_max}
                  </div>
                </div>
              </div>

              <div class="stats bg-base-100 shadow">
                <div class="stat">
                  <div class="stat-title">Planting Depth</div>
                  <div class="stat-value text-lg">{guide.planting_depth_cm}cm</div>
                </div>
                <div class="stat">
                  <div class="stat-title">Light Requirement</div>
                  <div class="stat-value text-lg">{guide.light_requirement}</div>
                </div>
              </div>
            </div>

            <div class="divider">Planting Schedule</div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="card bg-base-100 shadow-sm">
                <div class="card-body">
                  <h4 class="card-title text-success">Spring Planting</h4>
                  {guide.spring_start_week && guide.spring_end_week ? (
                    <p>Weeks {guide.spring_start_week} - {guide.spring_end_week}</p>
                  ) : (
                    <p class="text-error">Not recommended for spring planting</p>
                  )}
                  {guide.indoor_sowing_weeks_before_frost && (
                    <div class="badge badge-info">
                      Start indoors {guide.indoor_sowing_weeks_before_frost} weeks before last frost
                    </div>
                  )}
                </div>
              </div>

              <div class="card bg-base-100 shadow-sm">
                <div class="card-body">
                  <h4 class="card-title text-warning">Fall Planting</h4>
                  {guide.fall_start_week && guide.fall_end_week ? (
                    <p>Weeks {guide.fall_start_week} - {guide.fall_end_week}</p>
                  ) : (
                    <p class="text-error">Not recommended for fall planting</p>
                  )}
                </div>
              </div>
            </div>

            {(guide.stratification_required || guide.scarification_required) && (
              <>
                <div class="divider">Special Requirements</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guide.stratification_required && (
                    <div class="alert alert-info">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div class="font-bold">Requires Stratification</div>
                        <div class="text-sm">{guide.stratification_instructions}</div>
                      </div>
                    </div>
                  )}

                  {guide.scarification_required && (
                    <div class="alert alert-warning">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div class="font-bold">Requires Scarification</div>
                        <div class="text-sm">{guide.scarification_instructions}</div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {guide.special_requirements && (
              <div class="alert alert-warning mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{guide.special_requirements}</span>
              </div>
            )}

            {guide.germination_notes && (
              <div class="alert alert-info mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{guide.germination_notes}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}