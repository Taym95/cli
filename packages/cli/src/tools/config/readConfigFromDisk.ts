import Joi from '@hapi/joi';
import cosmiconfig from 'cosmiconfig';
import {JoiError} from './errors';
import * as schema from './schema';
import {
  UserConfig,
  UserDependencyConfig,
} from '@react-native-community/cli-types';

/**
 * Places to look for the new configuration
 */
const searchPlaces = ['react-native.config.js'];

/**
 * Reads a project configuration as defined by the user in the current
 * workspace.
 */
export function readConfigFromDisk(rootFolder: string): UserConfig {
  const explorer = cosmiconfig('react-native', {
    searchPlaces,
    stopDir: rootFolder,
  });

  const {config} = explorer.searchSync(rootFolder) || {config: undefined};

  const result = Joi.validate(config, schema.projectConfig);

  if (result.error) {
    throw new JoiError(result.error);
  }

  return result.value as UserConfig;
}

/**
 * Reads a dependency configuration as defined by the developer
 * inside `node_modules`.
 */
export function readDependencyConfigFromDisk(
  rootFolder: string,
): UserDependencyConfig {
  const explorer = cosmiconfig('react-native', {
    stopDir: rootFolder,
    searchPlaces,
  });

  const {config} = explorer.searchSync(rootFolder) || {config: undefined};

  const result = Joi.validate(config, schema.dependencyConfig);

  if (result.error) {
    throw new JoiError(result.error);
  }

  return result.value as UserDependencyConfig;
}
