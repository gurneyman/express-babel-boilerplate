import helmet from 'helmet';

const EXPECT_CT_CONFIG = {
    enforce: false,
    maxAge: 0
};

const FEATURE_POLICY_CONFIG = {
    features: {
        camera: ["'none'"],
        fullscreen: ["'none'"],
        geolocation: ["'none'"],
        gyroscope: ["'none'"],
        magnetometer: ["'none'"],
        microphone: ["'none'"],
        midi: ["'none'"],
        notifications: ["'none'"],
        payment: ["'none'"],
        push: ["'none'"],
        speaker: ["'none'"],
        syncXhr: ["'none'"],
        vibrate: ["'none'"],
    }
};

export default (app) => {
    app.use(helmet());
    app.use(helmet.permittedCrossDomainPolicies());
    app.use(helmet.expectCt(EXPECT_CT_CONFIG));
    app.use(helmet.featurePolicy(FEATURE_POLICY_CONFIG));
};


