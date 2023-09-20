const sdkPathPre = `./sdk/v${require('../package.json').version.replace(/\./g, '')}`;
const sdkList = [`${sdkPathPre}/zego-superboard-electron`];
console.log('===pack===', sdkList);

module.exports = {
    asarUnpack: sdkList,
    files: ['superboard', ...sdkList],
    asar: true,
    productName: 'zego-superboard-electron',
    appId: 'com.edu-sdk-test_index.app',
    copyright: 'zego-frontend',
    directories: {
        output: 'package_super'
    },
    nsis: {
        perMachine: true,
        differentialPackage: false,
        oneClick: false,
        allowElevation: true,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        deleteAppDataOnUninstall: true
    },
    mac: {
        artifactName: '${productName}.${ext}',
        icon:'./superboard/logo.png',
        target: [
            {
                target: 'dmg',
                arch: ['x64']
            }
        ],
        hardenedRuntime: true,
        gatekeeperAssess: false
    },
    win: {
        artifactName: '${productName}.${ext}',
        icon:'./superboard/logo.png',
        target: [
            {
                target: 'nsis',
                arch: ['ia32']
            }
        ]
    }
};
