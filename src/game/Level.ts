// To avoid thinking in x and y we talk here about:
//   - distance = how many tiles we have scrolled forward (can be fraction)
//   - lane     = which row of tiles are we talking about, perpendicular to distance
import { CurrentMission } from "../CurrentMission";

export class Level {
  // TODO: params: structures, enemies, max_defined_distance
  constructor() {
    // TODO
    //     -- we draw enemy in center of block of 4 tiles, but store them in the top-left tile's position
    //     local enemy_offset = _xy(_ts / 2, _ts / 2)
    //
    //     local min_visible_distance = 1
    //     local max_visible_distance = min_visible_distance + _vst - 1
    //
    //     local prev_spawn_distance = max_visible_distance
    //     local spawn_distance_offset = 2
    //     local spawn_distance = max_visible_distance + spawn_distance_offset
    //
    //     -- phase: intro -> main -> outro
    //     local phase = "intro"
    //
    //     _m_level_bg_init()
  }

  // TODO
  //         enter_phase_main = function()
  //             phase = "main"
  //         end,
  //
  // TODO
  //         progress_fraction = function()
  //             -- We remove 17 from max_visible_distance in order to make sure progress_fraction is not above 0 during mission intro phase.
  //             -- We remove 2 from max_defined_distance in order to make sure progress_fraction is not below 1 during mission boss phase.
  //             return mid(0, (max_visible_distance - 17) / (max_defined_distance - 2), 1)
  //         end,
  //
  // TODO
  //         has_scrolled_to_end = function()
  //             return phase == "main" and max_visible_distance >= max_defined_distance + 1 or phase == "outro"
  //         end,
  //
  // TODO
  //         enemies_to_spawn = function()
  //             if phase ~= "main" then
  //                 return {}
  //             end
  //
  //             local result = {}
  //             if spawn_distance > prev_spawn_distance then
  //                 prev_spawn_distance = spawn_distance
  //                 for lane = 1, 12 do
  //                     local enemy_map_marker = enemies[spawn_distance] and enemies[spawn_distance][lane] or nil
  //                     if enemy_map_marker then
  //                         add(result, {
  //                             enemy_map_marker = enemy_map_marker,
  //                             xy = _xy(
  //                                 (lane - .5) * _ts,
  //                                 _vs - _ts - (spawn_distance - min_visible_distance + .5) * _ts
  //                             ).plus(enemy_offset),
  //                         })
  //                     end
  //                 end
  //             end
  //             return result
  //         end,
  //
  update(): void {
    CurrentMission.levelBgUpdate();

    // TODO
    //             if phase ~= "outro" and min_visible_distance >= max_defined_distance + 3 then
    //                 phase = "outro"
    //             end
    //
    //             min_visible_distance = min_visible_distance + _m_scroll_per_frame / _ts
    //             if phase == "intro" then
    //                 -- loop infinitely
    //                 min_visible_distance = min_visible_distance % 1 + 1
    //             elseif phase == "main" then
    //                 spawn_distance = max(spawn_distance, flr(max_visible_distance) + spawn_distance_offset)
    //             elseif phase == "outro" then
    //                 -- loop infinitely
    //                 local distance_fraction = min_visible_distance - flr(min_visible_distance)
    //                 min_visible_distance = max_defined_distance + distance_fraction
    //             end
    //             max_visible_distance = min_visible_distance + _vst - 1
  }

  draw(): void {
    CurrentMission.levelBgDraw();

    // TODO
    //             if phase == "main" then
    //                 for distance = flr(min_visible_distance), ceil(max_visible_distance) do
    //                     for lane = 1, 12 do
    //                         local fg_tile = structures[distance][lane]
    //                         if fg_tile then
    //                             spr(
    //                                 fg_tile,
    //                                 _gaox + (lane - 1) * _ts,
    //                                 _vs - flr((distance - min_visible_distance + 1) * _ts)
    //                             )
    //                         end
    //                     end
    //                 end
    //             end
  }
}
