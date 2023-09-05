import { AnimatedSprite } from "../misc/AnimatedSprite";
import { MovementFactory } from "../movement/Movement";

export type EnemyProperties = {
  // TODO
  //     --   - [1] = health
  //     --   - [2] = score
  // TODO
  spriteMain: AnimatedSprite;
  //     --   - [3] = sprites_props_txt = "w,h,x,y|w,h,x,y" -- where 1st set is for a ship sprite, and 2nd – for a damage flash overlay
  // TODO
  //     --   - [4] = collision_circles_props = {
  //     --                    { r, optional_xy_offset }, -- put main/center circle first, since it will be source for explosions etc.
  //     --                    { r, optional_xy_offset },
  //     --                    { r },
  //     --                },
  //     --   - [5] = powerups_distribution
  movementFactory: MovementFactory;
  //     --   - spawn_bullets = function(enemy_movement, player_collision_circle)
  //     --                       return bullets_table
  //     --                     end
};
