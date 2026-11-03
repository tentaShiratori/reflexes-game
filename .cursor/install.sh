#!/usr/bin/env bash
set -euo pipefail
export PATH="/usr/local/bin:${PATH}"

NODE_VERSION="26.12.1"
PNPM_VERSION="11.17.0"
LEFTHOOK_VERSION="2.2.2"
NI_VERSION="30.6.0"

if [[ "$(/usr/local/bin/node -v 2>/dev/null || true)" != "v${NODE_VERSION}" ]]; then
  curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" -o "/tmp/node-v${NODE_VERSION}-linux-x64.tar.xz"
  sudo tar -xJ -C /usr/local --strip-components=1 --no-same-owner -f "/tmp/node-v${NODE_VERSION}-linux-x64.tar.xz"
fi

sudo mkdir -p /usr/local/libexec
if [[ "$(/usr/local/libexec/lefthook version 2>/dev/null || true)" != "${LEFTHOOK_VERSION}" ]]; then
  curl -fsSL -o /tmp/lefthook "https://github.com/evilmartians/lefthook/releases/download/v${LEFTHOOK_VERSION}/lefthook_${LEFTHOOK_VERSION}_Linux_x86_64"
  sudo install -m 755 /tmp/lefthook /usr/local/libexec/lefthook
fi

sudo tee /usr/local/bin/lefthook >/dev/null << 'WRAP'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "install" ]]; then
  hooks_path="$(git config --get core.hooksPath 2>/dev/null || true)"
  if [[ -n "${hooks_path}" ]]; then
    echo "lefthook install skipped: core.hooksPath is managed externally (${hooks_path})"
    exit 0
  fi
fi
exec /usr/local/libexec/lefthook "$@"
WRAP
sudo chmod 755 /usr/local/bin/lefthook

if [[ "$(/usr/local/bin/pnpm -v 2>/dev/null || true)" != "${PNPM_VERSION}" ]]; then
  sudo env PATH="/usr/local/bin:${PATH}" npm install -g "pnpm@${PNPM_VERSION}"
fi

ni_ver="$(/usr/local/bin/ni --version 2>/dev/null || true)"
case "${ni_ver}" in
  *"${NI_VERSION}"*) ;;
  *) sudo env PATH="/usr/local/bin:${PATH}" npm install -g "@antfu/ni@${NI_VERSION}" ;;
esac

if [[ ! -f /etc/profile.d/cursor-toolchain.sh ]]; then
  sudo tee /etc/profile.d/cursor-toolchain.sh >/dev/null << 'PROFILE'
export PATH="/usr/local/bin:${PATH}"
PROFILE
fi

if [[ -f "${HOME}/.bashrc" ]] && ! grep -q 'Pinned toolchain from mise.toml' "${HOME}/.bashrc"; then
  cat >> "${HOME}/.bashrc" << 'BASHRC'

# Pinned toolchain from mise.toml (node 26, pnpm 11) must precede nvm and /exec-daemon.
export PATH="/usr/local/bin:${PATH}"
BASHRC
fi

pnpm install --frozen-lockfile
