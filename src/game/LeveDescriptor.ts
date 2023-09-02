export class LeveDescriptor {
  static readonly noTileId = -1;

  // FYI: structures[distance = 0] and  structures[distance][lane = 0] are unused.
  //   It's a leftover from the 1-indexed tables in the Lua codebase of the previous
  //   game implementation.
  readonly structures: number[][];

  constructor() {
    // TODO: tmp
    this.structures = [
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
      Array.from({ length: 13 }, () => LeveDescriptor.noTileId),
    ];
  }
}

// TODO
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
// -- cart_mission/game/level_descriptor.lua --
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//
// function new_level_descriptor()
//     -- number below are sprites in the sprite sheet
//     -- * end of the level
//     local end_tile = 64
//     -- * enemy tiles, over empty space
//     local en_min, en_max = 73, 79
//     -- * enemy tiles, over structure
//     local en_over_st_min, en_over_st_max = 89, 95
//     -- * structure tiles (cw = clockwise, ccw = counterclockwise)
//     local st_center = 85
//     local st_edge_left, st_edge_right, st_edge_top, st_edge_bottom = _unpack_split "84,86,69,101"
//     local st_convex_left_top, st_convex_left_bottom, st_convex_right_top, st_convex_right_bottom = _unpack_split "68,100,70,102"
//     local st_concave_left_top_ccw, st_concave_left_top, st_concave_left_top_cw = _unpack_split "80,81,65"
//     local st_concave_left_bottom_ccw, st_concave_left_bottom, st_concave_left_bottom_cw = _unpack_split "113,97,96"
//     local st_concave_right_top_ccw, st_concave_right_top, st_concave_right_top_cw = _unpack_split "66,82,83"
//     local st_concave_right_bottom_ccw, st_concave_right_bottom, st_concave_right_bottom_cw = _unpack_split "99,98,114"
//
//     local max_defined_distance
//
//     -- markers from the map, combined into a single long 2D array and extended by several
//     -- extra columns on both sides in -- order to make further computations easier
//     local markers = {}
//     do
//         local markers_per_screen_w, x = 8, 1
//         for intro_infinite_scroll_x = 1, markers_per_screen_w + 1 do
//             markers[x] = { nil, nil, nil, nil, nil, nil }
//             x = x + 1
//         end
//         for level_descriptor_row = 0, 3 do
//             for map_x = 0, 127 do
//                 markers[x] = { nil, nil, nil, nil, nil, nil }
//                 local map_y = level_descriptor_row * 8
//                 for y = 1, 6 do
//                     local marker = mget(map_x, map_y + y)
//                     markers[x][y] = marker
//                     if marker == end_tile then
//                         max_defined_distance = (x - 1) * 2
//                         break
//                     end
//                 end
//                 x = x + 1
//                 if max_defined_distance then
//                     break
//                 end
//             end
//             if max_defined_distance then
//                 break
//             end
//         end
//         for outro_infinite_scroll_x = 1, markers_per_screen_w + 1 do
//             markers[x] = { nil, nil, nil, nil, nil, nil }
//             x = x + 1
//         end
//     end
//
//     -- conversion from markers to level descriptor
//     local structures_occupied, structures, enemies = { [-1] = {}, [0] = {} }, {}, {}
//     for x = 1, #markers do
//         local distance = x * 2 - 1
//         local distance2 = distance + 1
//         structures_occupied[distance] = {}
//         structures_occupied[distance2] = {}
//         structures[distance] = {}
//         structures[distance2] = {}
//         enemies[distance] = {}
//         enemies[distance2] = {}
//         for y = 1, 6 do
//             local lane = y * 2 - 1
//             local lane2 = lane + 1
//
//             local marker = markers[x][y]
//             if marker == st_center or (marker and marker >= en_over_st_min and marker <= en_over_st_max) then
//                 structures_occupied[distance][lane] = true
//                 structures_occupied[distance][lane2] = true
//                 structures_occupied[distance2][lane] = true
//                 structures_occupied[distance2][lane2] = true
//
//                 -- guard tiles to make further computations easier
//                 if lane == 1 then
//                     structures_occupied[distance][-1] = true
//                     structures_occupied[distance][0] = true
//                     structures_occupied[distance2][-1] = true
//                     structures_occupied[distance2][0] = true
//                 elseif lane2 == 12 then
//                     structures_occupied[distance][13] = true
//                     structures_occupied[distance][14] = true
//                     structures_occupied[distance2][13] = true
//                     structures_occupied[distance2][14] = true
//                 end
//                 if distance == 1 then
//                     structures_occupied[-1][lane] = true
//                     structures_occupied[-1][lane2] = true
//                     structures_occupied[0][lane] = true
//                     structures_occupied[0][lane2] = true
//                 end
//             end
//             if marker and marker >= en_min and marker <= en_max then
//                 enemies[distance][lane] = marker
//             elseif marker and marker >= en_over_st_min and marker <= en_over_st_max then
//                 enemies[distance][lane] = marker - (en_over_st_min - en_min)
//             end
//         end
//     end
//
//     -- conversion from occupied or not occupied structure tiles to specific structure tile variants
//     for distance = 2, #structures_occupied - 1 do
//         for lane = 1, 12 do
//
//             -- we are comparing here tiles around the middle chosen one:
//             --  - l = left
//             --  - r = right
//             --  - t = top
//             --  - b = bottom
//             --  - m = middle
//             local dist_t = distance
//             local dist_m = distance - 1
//             local dist_b = distance - 2
//             local lane_l = lane - 1
//             local lane_m = lane
//             local lane_r = lane + 1
//             local slt, smt, srt = structures_occupied[dist_t][lane_l], structures_occupied[dist_t][lane_m], structures_occupied[dist_t][lane_r]
//             local slm, smm, srm = structures_occupied[dist_m][lane_l], structures_occupied[dist_m][lane_m], structures_occupied[dist_m][lane_r]
//             local slb, smb, srb = structures_occupied[dist_b][lane_l], structures_occupied[dist_b][lane_m], structures_occupied[dist_b][lane_r]
//
//             structures[dist_m][lane_m] = (function()
//                 if smm then
//                     if not slm and not smt then
//                         return st_convex_left_top
//                     elseif not slm and not smb then
//                         // … and so on …
//                     end
//                 else
//                     if slm and slt and smt then
//                         return st_concave_left_top
//                     elseif slm and slb and smb then
//                         // … and so on …
//                     end
//                 end
//             end)()
//
//         end
//     end
//
//     return structures, enemies, max_defined_distance
// end
