// deno-lint-ignore-file no-explicit-any
import _dateTracking from './tracking.json' with { type: 'json' }

interface TrackingInfo {
    // yyyy-mm-dd
    originalDate: string,
    editDates: string[]
}

export const TrackingData = _dateTracking as any as Record<string, TrackingInfo>;
const TRACK_EDIT_DATE = Boolean(Deno.env.get('TRACK_EDIT_DATE'));

export function trackOriginalDates(site: Lume.Site) {
    site.addEventListener("afterRender", (_) => {
        for (const page of site.pages) {
            const { date, url } = page.data;
            const trackingInfo = TrackingData[url];
            const formattedDate = date?.toLocaleDateString('zh-CN')
            if (formattedDate) {
                if (!trackingInfo) {
                    // create for the first time
                    TrackingData[url] = { originalDate: formattedDate, editDates: [] }
                }
                else {
                    if (TRACK_EDIT_DATE && trackingInfo.editDates.length > 0 && trackingInfo.editDates[0] !== formattedDate) {
                        TrackingData[url] = {
                            originalDate: trackingInfo.originalDate,
                            editDates: [formattedDate, ...trackingInfo.editDates]
                        }
                    }
                }
            }
        }
        Deno.writeTextFileSync(`${import.meta.dirname}/tracking.json`, JSON.stringify(TrackingData, null, 2));
    });
}