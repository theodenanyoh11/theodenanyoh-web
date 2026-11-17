import * as migration_20250407_225250 from './20250407_225250';
import * as migration_20250407_233430 from './20250407_233430';
import * as migration_20250408_000603 from './20250408_000603';
import * as migration_20250408_000624 from './20250408_000624';
import * as migration_20261117_090000_payload_3_93 from './20261117_090000_payload_3_93';

export const migrations = [
  {
    up: migration_20250407_225250.up,
    down: migration_20250407_225250.down,
    name: '20250407_225250',
  },
  {
    up: migration_20250407_233430.up,
    down: migration_20250407_233430.down,
    name: '20250407_233430',
  },
  {
    up: migration_20250408_000603.up,
    down: migration_20250408_000603.down,
    name: '20250408_000603',
  },
  {
    up: migration_20250408_000624.up,
    down: migration_20250408_000624.down,
    name: '20250408_000624'
  },
  {
    up: migration_20261117_090000_payload_3_93.up,
    down: migration_20261117_090000_payload_3_93.down,
    name: '20261117_090000_payload_3_93',
  },
];
