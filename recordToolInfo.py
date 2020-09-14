#! /usr/bin/env python3

import json
import sys
import click


@click.group(invoke_without_command=True)
def cli():
    pass


mapping_file = "./data.json"
with open(mapping_file) as f:
    mappings = json.loads(f.read())


@cli.command()
def add():
    """Interactively add a tool that will convert THIS to THAT."""
    from_format = [x.strip() for x in input("Source format: ").strip().split(',')]
    if len(from_format) > 1:
        print("info: found multiple source formats")

    to_format = [x.strip() for x in input("Target format: ").strip().split(',')]
    if len(to_format) > 1:
        print("info: found multiple to formats")

    tool = input("Tool name: ").strip()
    source = input("Package/source?: ").strip()
    url = input("Url?: ").strip()
    snippet = input("Snippet (optional)?: ").strip()

    for iter_source in from_format:
        if iter_source not in mappings:
            mappings[iter_source] = {}

        for iter_target in to_format:
            print(f"info: okay adding {iter_source} - {iter_target}")
            if iter_target not in mappings.get(iter_source):
                mappings[iter_source][iter_target] = []
            else:
                print(f"info: found pre-existing target formats: {','.join(mappings[iter_source].keys())}")

            if tool in [x["tool"] for x in mappings[iter_source][iter_target]]:
                print("thanks, but entry already exists!")
                continue

            mappings[iter_source][iter_target].append({
                "tool": tool,
                "source": source,
                "url": url,
                "snippet": snippet
            })

    with open(mapping_file, 'w') as f:
        f.write(json.dumps(mappings, indent=4))


@cli.command()
@click.argument("this")
@click.argument("that")
def get(this, that):
    """Get tools that will convert THIS to THAT. """
    print(mappings.get(this, {}).get(that, {}))


if __name__ == '__main__':
    cli()
