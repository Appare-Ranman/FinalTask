import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const proposalNames: string[] = ["0x4a6f204269646f6e000000000000000000000000000000000000000000000000","0x446f6e616c642044756b00000000000000000000000000000000000000000000"];
    const { deployer } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;

    await deploy("YourContract", {
        from: deployer,
        args: [proposalNames],
        log: true,
        autoMine: true,
    });

    const yourContract = await hre.ethers.getContract<Contract>("YourContract", deployer);
};

export default deployYourContract;
deployYourContract.tags = ["YourContract"];