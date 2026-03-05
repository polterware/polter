#!/usr/bin/env node
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { spawn } from 'child_process';
import Conf from 'conf';

const config = new Conf({ projectName: 'polterbase' });

const supabaseCommands = {
  'Quick Start': [
    { value: 'bootstrap', label: 'bootstrap - Bootstrap a Supabase project from a starter template' }
  ],
  'Local Development': [
    { value: 'db', label: 'db - Manage Postgres databases' },
    { value: 'gen', label: 'gen - Run code generation tools' },
    { value: 'init', label: 'init - Initialize a local project' },
    { value: 'inspect', label: 'inspect - Tools to inspect your Supabase project' },
    { value: 'link', label: 'link - Link to a Supabase project' },
    { value: 'login', label: 'login - Authenticate using an access token' },
    { value: 'logout', label: 'logout - Log out and delete access tokens locally' },
    { value: 'migration', label: 'migration - Manage database migration scripts' },
    { value: 'seed', label: 'seed - Seed a Supabase project from supabase/config.toml' },
    { value: 'services', label: 'services - Show versions of all Supabase services' },
    { value: 'start', label: 'start - Start containers for Supabase local development' },
    { value: 'status', label: 'status - Show status of local Supabase containers' },
    { value: 'stop', label: 'stop - Stop all local Supabase containers' },
    { value: 'test', label: 'test - Run tests on local Supabase containers' },
    { value: 'unlink', label: 'unlink - Unlink a Supabase project' }
  ],
  'Management APIs': [
    { value: 'backups', label: 'backups - Manage Supabase physical backups' },
    { value: 'branches', label: 'branches - Manage Supabase preview branches' },
    { value: 'config', label: 'config - Manage Supabase project configurations' },
    { value: 'domains', label: 'domains - Manage custom domain names for Supabase projects' },
    { value: 'encryption', label: 'encryption - Manage encryption keys of Supabase projects' },
    { value: 'functions', label: 'functions - Manage Supabase Edge functions' },
    { value: 'network-bans', label: 'network-bans - Manage network bans' },
    { value: 'network-restrictions', label: 'network-restrictions - Manage network restrictions' },
    { value: 'orgs', label: 'orgs - Manage Supabase organizations' },
    { value: 'postgres-config', label: 'postgres-config - Manage Postgres database config' },
    { value: 'projects', label: 'projects - Manage Supabase projects' },
    { value: 'secrets', label: 'secrets - Manage Supabase secrets' },
    { value: 'snippets', label: 'snippets - Manage Supabase SQL snippets' },
    { value: 'ssl-enforcement', label: 'ssl-enforcement - Manage SSL enforcement configuration' },
    { value: 'sso', label: 'sso - Manage Single Sign-On (SSO) authentication for projects' },
    { value: 'storage', label: 'storage - Manage Supabase Storage objects' },
    { value: 'vanity-subdomains', label: 'vanity-subdomains - Manage vanity subdomains for Supabase projects' }
  ],
  'Additional Commands': [
    { value: 'completion', label: 'completion - Generate the autocompletion script' },
    { value: 'help', label: 'help - Help about any command' }
  ]
};

const globalFlags = [
  { value: '--create-ticket', label: '--create-ticket (Create support ticket on error)' },
  { value: '--debug', label: '--debug (Output debug logs)' },
  { value: '--experimental', label: '--experimental (Enable experimental features)' },
  { value: '--yes', label: '--yes (Answer yes to all prompts)' }
];

function getPinnedCommands(): string[] {
  return (config.get('pinnedCommands') as string[]) || [];
}

function addPinnedCommand(cmd: string) {
  const current = getPinnedCommands();
  if (!current.includes(cmd)) {
    config.set('pinnedCommands', [...current, cmd]);
  }
}

function removePinnedCommand(cmd: string) {
  const current = getPinnedCommands();
  config.set('pinnedCommands', current.filter(c => c !== cmd));
}

async function main() {
  console.clear();
  p.intro(`${pc.bgGreen(pc.black(' POLTERBASE '))} The ultimate modern CLI for Supabase`);

  let shouldExit = false;

  while (!shouldExit) {
    const pinned = getPinnedCommands();
    const mainOptions = [
      { value: 'Quick Start', label: 'Quick Start (Bootstrap templates)' },
      { value: 'Local Development', label: 'Local Development (db, init, start, etc.)' },
      { value: 'Management APIs', label: 'Management APIs (projects, secrets, domains, etc.)' },
      { value: 'Additional Commands', label: 'Additional Commands (help, completion)' },
      { value: 'Custom', label: 'Custom Command / Check Version' }
    ];

    if (pinned.length > 0) {
      mainOptions.unshift(
        { value: 'MANAGE_PINS', label: pc.magenta('⚙️ Manage Pinned Commands') },
        ...pinned.map(cmd => ({ value: `PIN:${cmd}`, label: `${pc.cyan('📌')} ${cmd}` })),
        // @ts-ignore
        { value: 'SEPARATOR', label: pc.dim('──────────────────────────────'), disabled: true }
      );
    }

    mainOptions.push({ value: 'EXIT', label: pc.red('Exit Polterbase') });

    const category = await p.select({
      message: 'What kind of Supabase command do you want to run?',
      // @ts-ignore
      options: mainOptions.filter(opt => opt.value !== 'SEPARATOR'),
      maxItems: 12
    });

    if (p.isCancel(category) || category === 'EXIT') {
      p.cancel('See you later!');
      process.exit(0);
    }

    if (category === 'MANAGE_PINS') {
      const toRemove = await p.multiselect({
        message: 'Select commands to remove from pins (Space to select):',
        options: pinned.map(cmd => ({ value: cmd, label: cmd })),
        required: false
      });
      if (!p.isCancel(toRemove) && Array.isArray(toRemove)) {
        toRemove.forEach(cmd => removePinnedCommand(cmd));
        p.log.success('Pins updated!');
      }
      continue;
    }

    let finalArgs: string[] = [];
    let isPinnedExecution = false;

    if (typeof category === 'string' && category.startsWith('PIN:')) {
      const cmdStr = category.replace('PIN:', '');
      finalArgs = cmdStr.split(' ');
      isPinnedExecution = true;
    } else {
      let commandValue = '';

      if (category === 'Custom') {
        const custom = await p.text({
          message: 'Enter your custom supabase command/flags (e.g., "-v" or "status -o json"):',
          placeholder: '-v'
        });
        if (p.isCancel(custom)) continue;
        commandValue = custom as string;
      } else {
        const options = [
          { value: 'BACK', label: pc.yellow('← Go Back') },
          // @ts-ignore
          ...supabaseCommands[category]
        ];

        const command = await p.select({
          message: `Select a command from ${category}:`,
          options: options,
          maxItems: 11
        });

        if (p.isCancel(command) || command === 'BACK') continue;

        const extraArgs = await p.text({
          message: `Any additional sub-commands or arguments for "supabase ${command}"?`,
          placeholder: 'e.g., "push", "pull", "list" (Press Enter to skip)',
          initialValue: ''
        });

        if (p.isCancel(extraArgs)) continue;

        commandValue = `${command} ${extraArgs}`.trim();
      }

      const selectedFlags = await p.multiselect({
        message: 'Select any global flags you want to include (Space to select, Enter to confirm):',
        options: globalFlags,
        required: false
      });

      if (p.isCancel(selectedFlags)) continue;

      finalArgs = commandValue.split(' ').filter(Boolean);
      if (Array.isArray(selectedFlags) && selectedFlags.length > 0) {
        finalArgs = finalArgs.concat(selectedFlags);
      }
    }

    const finalCmdString = `supabase ${finalArgs.join(' ')}`;

    const confirm = await p.confirm({
      message: `Ready to execute: ${pc.cyan(finalCmdString)}. Continue?`,
      initialValue: true
    });

    if (p.isCancel(confirm)) continue;
    
    if (!confirm) {
      const action = await p.select({
        message: 'Command cancelled. What next?',
        options: [
          { value: 'RETRY', label: 'Try another command' },
          { value: 'EXIT', label: 'Exit' }
        ]
      });
      if (action === 'RETRY') continue;
      break;
    }

    p.outro(`Executing: ${pc.cyan(finalCmdString)}`);

    const child = spawn('supabase', finalArgs, {
      stdio: 'inherit',
      shell: true
    });

    await new Promise<void>((resolve) => {
      child.on('error', (err) => {
        console.error(pc.red(`Failed to start command: ${err.message}`));
        resolve();
      });

      child.on('exit', (code) => {
        if (code !== 0) {
          console.log(pc.red(`\nCommand exited with code ${code}`));
        } else {
          console.log(pc.green('\nCommand finished successfully!'));
          
          if (!isPinnedExecution && !getPinnedCommands().includes(finalArgs.join(' '))) {
            setTimeout(async () => {
                const shouldPin = await p.confirm({
                    message: pc.magenta('Pin this command for easy access next time?'),
                    initialValue: false
                });
                if (shouldPin && !p.isCancel(shouldPin)) {
                    addPinnedCommand(finalArgs.join(' '));
                    p.log.success('Pinned! You can find it at the top of the main menu.');
                }
            }, 100);
          }
        }
        resolve();
      });
    });

    const next = await p.confirm({
      message: 'Do you want to run another command?',
      initialValue: true
    });

    if (!next || p.isCancel(next)) {
      shouldExit = true;
    } else {
      console.clear();
      p.intro(`${pc.bgGreen(pc.black(' POLTERBASE '))} Continue managing your Supabase project`);
    }
  }

  p.outro('Thank you for using Polterbase!');
}

main().catch(console.error);
