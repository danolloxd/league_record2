import type videojs from 'video.js';
import type { ContentDescriptor } from 'video.js/dist/types/utils/dom';
import type { MarkerFlags, GameData } from './bindings';

export default class UI {

    private readonly modal;
    private readonly modalContent;
    private readonly sidebar;
    private readonly videoFolderBtn;
    private readonly recordingsSize;
    private readonly descriptionLeft;
    private readonly descriptionCenter;

    private readonly checkboxKill;
    private readonly checkboxDeath;
    private readonly checkboxAssist;
    private readonly checkboxTurret;
    private readonly checkboxInhibitor;
    private readonly checkboxDragon;
    private readonly checkboxHerald;
    private readonly checkboxBaron;

    private readonly vjs: typeof videojs;
    private readonly windowManager: any;

    private readonly boundHideModal;

    constructor(vjs: typeof videojs, windowManager: any) {
        this.vjs = vjs;
        this.windowManager = windowManager;
        this.boundHideModal = this.hideModal.bind(this);

        this.modal = document.querySelector<HTMLDivElement>('[id="modal"]')!;
        this.modalContent = document.querySelector<HTMLDivElement>('[id="modal-content"]')!;
        this.sidebar = document.querySelector<HTMLUListElement>('[id="sidebar-content"]')!;
        this.videoFolderBtn = document.querySelector<HTMLButtonElement>('[id="vid-folder-btn"]')!;
        this.recordingsSize = document.querySelector<HTMLSpanElement>('[id="size-inner"]')!;
        this.descriptionLeft = document.querySelector<HTMLDivElement>('[id="description-left"]')!;
        this.descriptionCenter = document.querySelector<HTMLDivElement>('[id="description-center"]')!;

        this.checkboxKill = document.querySelector<HTMLInputElement>('[id="kill"]')!;
        this.checkboxDeath = document.querySelector<HTMLInputElement>('[id="death"]')!;
        this.checkboxAssist = document.querySelector<HTMLInputElement>('[id="assist"]')!;
        this.checkboxTurret = document.querySelector<HTMLInputElement>('[id="turret"]')!;
        this.checkboxInhibitor = document.querySelector<HTMLInputElement>('[id="inhibitor"]')!;
        this.checkboxDragon = document.querySelector<HTMLInputElement>('[id="dragon"]')!;
        this.checkboxHerald = document.querySelector<HTMLInputElement>('[id="herald"]')!;
        this.checkboxBaron = document.querySelector<HTMLInputElement>('[id="baron"]')!;
    }

    public async setFullscreen(fullscreen: boolean) {
        await this.windowManager.setFullscreen(fullscreen);
    }

    public setWindowTitle(title: string) {
        this.windowManager.setTitle('League Record - ' + title);
    }

    public setRecordingsFolderBtnOnClickHandler(handler: (e: MouseEvent) => void) {
        this.videoFolderBtn.onclick = handler;
    }

    public setCheckboxOnClickHandler(handler: (e: MouseEvent) => void) {
        this.checkboxKill.onclick = handler;
        this.checkboxDeath.onclick = handler;
        this.checkboxAssist.onclick = handler;
        this.checkboxTurret.onclick = handler;
        this.checkboxInhibitor.onclick = handler;
        this.checkboxDragon.onclick = handler;
        this.checkboxHerald.onclick = handler;
        this.checkboxBaron.onclick = handler;
    }

    public updateSideBar(
        recordingsSizeGb: number,
        videoIds: ReadonlyArray<string>,
        onVideo: (videoId: string) => void,
        onRename: (videoId: string) => void,
        onDelete: (videoId: string) => void
    ) {
        const videoLiElements = videoIds.map(videoId => {
            const videoName = videoId.slice(0, -4);

            // call event.stopPropagation(); to stop the onclick event from also effecting the element under the clicked X button
            const renameBtn = this.vjs.dom.createEl(
                'span',
                {
                    'onclick': (e: MouseEvent) => {
                        e.stopPropagation();
                        onRename(videoId);
                    }
                },
                { 'class': 'rename' },
                '✎'
            );
            const deleteBtn = this.vjs.dom.createEl(
                'span',
                {
                    'onclick': (e: MouseEvent) => {
                        e.stopPropagation();
                        onDelete(videoId);
                    }
                },
                { 'class': 'delete' },
                '×'
            );
            return this.vjs.dom.createEl(
                'li',
                { 'onclick': () => onVideo(videoId) },
                { 'id': videoId },
                [videoName, renameBtn, deleteBtn]
            );
        });

        this.vjs.dom.insertContent(this.sidebar, videoLiElements);
        this.vjs.dom.insertContent(this.recordingsSize, recordingsSizeGb.toFixed(2).toString());
    }

    public showModal(content: ContentDescriptor) {
        this.vjs.dom.insertContent(this.modalContent, content);
        this.modal.style.display = 'block';
    }

    public hideModal() {
        this.vjs.dom.emptyEl(this.modalContent);
        this.modal.style.display = 'none';
    }

    public modalIsOpen() {
        return this.modal.style.display === 'block';
    }

    public async showErrorModal(text: string) {
        this.showModal([
            this.vjs.dom.createEl('p', {}, {}, text),
            this.vjs.dom.createEl('p', {}, {}, this.vjs.dom.createEl('button', { 'onclick': this.boundHideModal }, { 'class': 'btn' }, 'Close')),
        ]);
    }

    public async showRenameModal(
        videoId: string,
        videoIds: ReadonlyArray<string>,
        rename: (videoId: string, newVideoId: string) => void
    ) {
        const videoName = videoId.slice(0, -4);

        const input = this.vjs.dom.createEl(
            'input',
            {},
            {
                'type': 'text',
                'id': 'new-name',
                'value': videoName,
                'placeholder': 'new name',
                'spellcheck': 'false',
                'autocomplete': 'off'
            }
        ) as HTMLInputElement;
        const saveButton = this.vjs.dom.createEl(
            'button',
            {
                'onclick': (e: MouseEvent) => {
                    if (input.validity.valid) {
                        e.preventDefault();
                        this.boundHideModal();
                        rename(videoId, input.value);
                    }
                }
            },
            { 'class': 'btn', 'disabled': true },
            'Save'
        ) as HTMLButtonElement;
        const cancelButton = this.vjs.dom.createEl(
            'button',
            { 'onclick': this.boundHideModal },
            { 'class': 'btn' },
            'Cancel'
        ) as HTMLButtonElement;

        this.showModal([
            this.vjs.dom.createEl('p', {}, {}, ['Change name of: ', this.vjs.dom.createEl('u', {}, {}, videoName)]),
            this.vjs.dom.createEl('p', {}, {}, input),
            this.vjs.dom.createEl('p', {}, {}, [saveButton, cancelButton])
        ]);

        input.addEventListener('input', _ => {
            if (videoIds.includes(input.value + '.mp4')) {
                input.setCustomValidity('there is already a file with this name');
                saveButton.setAttribute('disabled', 'true');
            } else {
                input.setCustomValidity('');
                saveButton.removeAttribute('disabled');
            }

            input.reportValidity();
        })

        input.setSelectionRange(input.value.length, input.value.length);
        input.focus();
    }

    public async showDeleteModal(videoId: string, deleteVideo: (videoId: string) => void) {
        const videoName = videoId.slice(0, -4);

        const prompt = this.vjs.dom.createEl('p', {}, {}, ['Delete recording: ', this.vjs.dom.createEl('u', {}, {}, videoName), '?']);
        const buttons = this.vjs.dom.createEl('p', {}, {}, [
            this.vjs.dom.createEl('button', {
                'onclick': (_: MouseEvent) => {
                    this.boundHideModal();
                    deleteVideo(videoId);
                }
            }, { 'class': 'btn' }, 'Delete'),
            this.vjs.dom.createEl('button', { 'onclick': this.boundHideModal }, { 'class': 'btn' }, 'Cancel'),
        ]);

        this.showModal([prompt, buttons]);
    }

    public getActiveVideoId(): string | null {
        return this.sidebar.querySelector<HTMLLIElement>('li.active')?.id ?? null;
    }

    public setActiveVideoId(videoId: string | null) {
        this.sidebar.querySelector<HTMLLIElement>('li.active')?.classList.remove('active');
        if (videoId !== null) {
            const videoLi = this.sidebar.querySelector<HTMLLIElement>(`[id='${videoId}']`);
            videoLi?.classList.add('active');
            return videoLi !== null;
        } else {
            return true;
        }
    }

    public setVideoDescription(left: ContentDescriptor, center: ContentDescriptor) {
        this.vjs.dom.insertContent(this.descriptionLeft, left);
        this.vjs.dom.insertContent(this.descriptionCenter, center);
    }

    public setVideoDescriptionStats(data: GameData) {
        if (!data) {
            this.setVideoDescription('', 'No Data');
            return;
        }

        const stats = data['stats'];

        const summoner = this.vjs.dom.createEl(
            'span',
            {},
            { 'class': 'summoner-name' },
            data['gameInfo']['summonerName']
        );
        const score1 = `${data['gameInfo']['championName']} - ${stats['kills']}/${stats['deaths']}/${stats['assists']}`;
        const score2 = `${stats['minionsKilled']! + stats['neutralMinionsKilled']!} CS | ${stats['wardScore']!.toFixed(2).toString()} WS`;

        const gameMode = `Game Mode: ${data['gameInfo']['gameMode']}`;
        const result = data['win'] !== null && (
            data['win'] ?
                this.vjs.dom.createEl('span', {}, { 'class': 'win' }, 'Victory')
                : this.vjs.dom.createEl('span', {}, { 'class': 'loss' }, 'Defeat')
        );

        this.setVideoDescription(
            [
                summoner,
                this.vjs.dom.createEl('br'),
                score1,
                this.vjs.dom.createEl('br'),
                score2
            ],
            [
                gameMode,
                this.vjs.dom.createEl('br'),
                result
            ]
        );
    }

    public showBigPlayButton(show: boolean) {
        const bpb = document.querySelector<HTMLButtonElement>('.vjs-big-play-button');
        if (bpb !== null) {
            bpb.style.display = show ? 'block !important' : 'none !important';
        }
    }

    public setCheckboxes(settings: MarkerFlags) {
        this.checkboxKill.checked = settings.kill;
        this.checkboxDeath.checked = settings.death;
        this.checkboxAssist.checked = settings.assist;
        this.checkboxTurret.checked = settings.turret;
        this.checkboxInhibitor.checked = settings.inhibitor;
        this.checkboxDragon.checked = settings.dragon;
        this.checkboxHerald.checked = settings.herald;
        this.checkboxBaron.checked = settings.baron;
    }

    public getCheckboxes(): MarkerFlags {
        return {
            kill: this.checkboxKill.checked,
            death: this.checkboxDeath.checked,
            assist: this.checkboxAssist.checked,
            turret: this.checkboxTurret.checked,
            inhibitor: this.checkboxInhibitor.checked,
            dragon: this.checkboxDragon.checked,
            herald: this.checkboxHerald.checked,
            baron: this.checkboxBaron.checked,
        };
    }

}